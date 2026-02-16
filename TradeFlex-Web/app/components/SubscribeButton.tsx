//
//  app/components/SubscribeButton.tsx
//  Handle Stripe Checkout redirection
//

'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscribeButtonProps {
  plan: 'monthly' | 'yearly';
  text: string;
  className?: string;
}

export default function SubscribeButton({ plan, text, className }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const { url, error } = await res.json();

      if (error) {
        console.error(error);
        alert('Checkout failed: ' + error);
        setLoading(false);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-4 h-4" />
          Processing...
        </>
      ) : (
        text
      )}
    </button>
  );
}
