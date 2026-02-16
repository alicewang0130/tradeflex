import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Need Service Role Key to bypass RLS and write to subscriptions table
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'service_role_mock'
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  // apiVersion: '2025-01-27.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) throw new Error('Missing signature or secret');
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle Events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan; // 'monthly' or 'yearly'

        if (!userId) break;

        // Retrieve subscription details to get end date
        const subscription: any = await stripe.subscriptions.retrieve(session.subscription as string);

        // Upsert into Supabase
        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          plan: plan || 'monthly',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.supabase_user_id; // Sometimes metadata isn't on subscription object, need customer lookup
        
        // If metadata is missing on subscription, lookup by customer ID in our DB
        let targetUserId = userId;
        if (!targetUserId) {
           const { data } = await supabaseAdmin
             .from('subscriptions')
             .select('user_id')
             .eq('stripe_customer_id', subscription.customer as string)
             .single();
           targetUserId = data?.user_id;
        }

        if (targetUserId) {
          await supabaseAdmin.from('subscriptions').update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('user_id', targetUserId);
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook Handler Error:', err);
    return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
