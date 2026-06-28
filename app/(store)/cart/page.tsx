'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-dark-600 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="text-dark-400">Looks like you haven&apos;t added any products yet.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-dark-600" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{item.name}</h3>
                  <p className="text-primary-400 font-semibold">
                    {formatPrice(item.price, item.currency)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 bg-dark-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1.5 rounded hover:bg-dark-700 text-dark-300 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-white text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1.5 rounded hover:bg-dark-700 text-dark-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Line Total */}
                <p className="text-white font-semibold w-24 text-right">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-bold text-white">Order Summary</h2>
              
              <div className="space-y-2 pb-4 border-b border-dark-700/50">
                <div className="flex justify-between text-dark-300">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(totalPrice(), items[0]?.currency || 'USD')}</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(totalPrice(), items[0]?.currency || 'USD')}</span>
              </div>

              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link href="/products" className="block text-center text-dark-400 hover:text-primary-400 text-sm transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
