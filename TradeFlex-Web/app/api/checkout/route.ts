import { NextResponse } from 'next/server';
import { createClient } from '../../lib/supabase-server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  // apiVersion: '2025-01-27.acacia',
});

// Price IDs - Replace with real ones from Alice's Stripe Dashboard later
const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  yearly: process.env.STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
};

export async function POST(request: Request) {
  try {
    // 1. Get User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body; // 'monthly' | 'yearly'
    
    // MOCK MODE CHECK
    const isMock = process.env.STRIPE_SECRET_KEY?.includes('mock') || !process.env.STRIPE_SECRET_KEY;
    if (isMock) {
        const origin = request.headers.get('origin') || 'http://localhost:3000';
        return NextResponse.json({ 
            url: `${origin}/mock-checkout?plan=${plan}&userId=${user.id}` 
        });
    }

    const priceId = PRICES[plan as keyof typeof PRICES];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // 2. Check if user already has a Stripe Customer ID in Supabase
    // (We'll check our 'subscriptions' table, or create a new customer)
    let customerId;
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Create new Stripe Customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id, // Important for webhook matching
        },
      });
      customerId = customer.id;
    }

    // 3. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/pricing`,
      metadata: {
        supabase_user_id: user.id,
        plan: plan,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
