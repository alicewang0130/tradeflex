//
//  app/mock-checkout/page.tsx
//  Mock Payment Gateway for Demo
//

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, CreditCard, Lock } from 'lucide-react';

export default function MockCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'monthly';
  const price = plan === 'yearly' ? '$29.99' : '$3.99';
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');

  const handlePay = async () => {
    setLoading(true);
    setStep('processing');

    try {
      // Call our own webhook to simulate Stripe success
      // In production, Stripe does this. In mock mode, we do it manually.
      await fetch('/api/webhooks/stripe?mock=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'checkout.session.completed',
          data: {
            object: {
              customer: 'cus_mock_12345',
              subscription: 'sub_mock_67890',
              metadata: {
                supabase_user_id: searchParams.get('userId'), // We need to pass this!
                plan: plan
              }
            }
          }
        })
      });

      // Wait a bit for effect
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          router.push('/profile?session_id=mock_success');
        }, 1500);
      }, 1500);

    } catch (err) {
      alert('Mock payment failed');
      setLoading(false);
      setStep('review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-[#635BFF] p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <CreditCard size={32} />
            </div>
          </div>
          <h1 className="text-xl font-bold">TradeFlex Pro ({plan})</h1>
          <p className="opacity-80">{price} / {plan === 'yearly' ? 'year' : 'month'}</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {step === 'review' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{price}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span>{price}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 flex gap-2">
                <Lock size={14} className="shrink-0 mt-0.5" />
                <span>This is a MOCK payment page. No real money will be charged.</span>
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-[#635BFF] hover:bg-[#5851E1] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-200 active:scale-[0.98]"
              >
                Pay {price}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-[#635BFF]/30 border-t-[#635BFF] rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="font-bold text-gray-800">Processing payment...</h3>
              <p className="text-sm text-gray-500">Confirming with bank</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="font-bold text-gray-800 text-xl">Success!</h3>
              <p className="text-sm text-gray-500">Redirecting to TradeFlex...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
