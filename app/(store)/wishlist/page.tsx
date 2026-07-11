'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: wishlistIds, removeItem } = useWishlistStore();
  const addToCart = useCartStore(state => state.addItem);
  const addToast = useUIStore(state => state.addToast);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || wishlistIds.length === 0) {
      setLoading(false);
      return;
    }
    
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const wishlistProducts = data.data?.filter((p: Product) => wishlistIds.includes(p.id)) || [];
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [mounted, wishlistIds]);

  if (!mounted) return null;

  if (wishlistIds.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 text-dark-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your wishlist is empty</h2>
          <p className="text-dark-400">Save products you love for later.</p>
          <Link href="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="glass-card overflow-hidden">
              <div className="aspect-square bg-white dark:bg-dark-900800 relative">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="25vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-dark-600" />
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <h3 className="text-gray-900 dark:text-white font-medium truncate">{product.name}</h3>
                <p className="text-primary-400 font-bold">{formatPrice(product.price, product.currency)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0] || '',
                        quantity: 1,
                        maxStock: product.stock_quantity,
                        currency: product.currency,
                      });
                      removeItem(product.id);
                      addToast({ message: 'Moved to cart', type: 'success' });
                    }}
                    className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      removeItem(product.id);
                      addToast({ message: 'Removed from wishlist', type: 'info' });
                    }}
                    className="p-2 rounded-lg border border-gray-300 dark:border-dark-700700 text-dark-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
