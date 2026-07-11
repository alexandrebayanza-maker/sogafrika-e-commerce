'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { COUNTRIES, CURRENCIES } from '@/lib/constants';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Phone number is required'),
  address: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  notes: z.string().optional(),
  currency: z.string().default('USD'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { currency: 'USD' },
  });

  const selectedCurrency = watch('currency');

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
          customerInfo: data,
          currency: data.currency.toLowerCase(),
        }),
      });

      const result = await res.json();

      if (result.url) {
        clearCart();
        window.location.href = result.url;
      } else {
        throw new Error(result.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark-300 text-sm mb-1">Full Name *</label>
                    <input {...register('fullName')} className="input-field" placeholder="John Doe" />
                    {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-dark-300 text-sm mb-1">Email *</label>
                    <input {...register('email')} type="email" className="input-field" placeholder="john@example.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark-300 text-sm mb-1">Phone *</label>
                    <input {...register('phone')} type="tel" className="input-field" placeholder="+243 990" />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-dark-300 text-sm mb-1">Currency *</label>
                    <select {...register('currency')} className="input-field">
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.symbol} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm mb-1">Delivery Address *</label>
                  <input {...register('address')} className="input-field" placeholder="Street address" />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark-300 text-sm mb-1">City *</label>
                    <input {...register('city')} className="input-field" placeholder="City" />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-dark-300 text-sm mb-1">Country *</label>
                    <select {...register('country')} className="input-field">
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm mb-1">Notes (optional)</label>
                  <textarea {...register('notes')} className="input-field resize-none" rows={3} placeholder="Any special instructions..." />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                
                <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-dark-200 text-sm truncate">{item.name}</p>
                        <p className="text-dark-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-dark-200 text-sm font-medium ml-2">
                        {formatPrice(item.price * item.quantity, selectedCurrency)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-300 dark:border-dark-700/50 pt-4 space-y-2">
                  <div className="flex justify-between text-dark-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice(), selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-dark-300">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-dark-700/50">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice(), selectedCurrency)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay with Stripe
                    </>
                  )}
                </button>

                <p className="text-dark-500 text-xs text-center">
                  Secure payment powered by Stripe. Your data is protected.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
