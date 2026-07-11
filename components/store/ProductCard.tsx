'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getStockStatus, truncateText } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useUIStore } from '@/stores/ui-store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const toggleWishlist = useWishlistStore(state => state.toggleItem);
  const isInWishlist = useWishlistStore(state => state.isInWishlist(product.id));
  const addToast = useUIStore(state => state.addToast);
  const stockStatus = getStockStatus(product.stock_quantity, product.low_stock_threshold);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Defer persisted store values until after mount to prevent hydration mismatch
  const wishlisted = mounted ? isInWishlist : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity === 0) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      quantity: 1,
      maxStock: product.stock_quantity,
      currency: product.currency,
    });
    addToast({ message: `${product.name} added to cart`, type: 'success' });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    addToast({
      message: wishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      type: 'info',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative rounded-xl overflow-hidden bg-white dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700800/50 hover:border-primary-500/30 transition-all duration-300 hover:shadow-glow">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-white dark:bg-dark-900800">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white dark:bg-dark-900800">
                <ShoppingCart className="w-12 h-12 text-dark-600" />
              </div>
            )}
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-white dark:bg-dark-900950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="p-3 rounded-full bg-primary-500 text-gray-900 dark:text-white hover:bg-primary-400 transition-all transform scale-0 group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-3 rounded-full transition-all transform scale-0 group-hover:scale-100 ${
                  wishlisted ? 'bg-red-500 text-gray-900 dark:text-white' : 'bg-white dark:bg-dark-900700 text-gray-900 dark:text-white hover:bg-white dark:bg-dark-900600'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.compare_at_price && (
                <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-gray-900 dark:text-white rounded-md">
                  Sale
                </span>
              )}
              {product.featured && (
                <span className="px-2 py-1 text-xs font-semibold bg-primary-500 text-gray-900 dark:text-white rounded-md">
                  Featured
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                stockStatus.color === 'green' ? 'bg-green-500/20 text-green-400' :
                stockStatus.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {stockStatus.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            {product.category && (
              <p className="text-xs text-primary-400 font-medium uppercase tracking-wider">
                {product.category.name}
              </p>
            )}
            <h3 className="text-gray-900 dark:text-white font-semibold group-hover:text-primary-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-dark-400 text-sm line-clamp-2">
                {truncateText(product.description, 80)}
              </p>
            )}
            
            {/* Rating */}
            {product.rating_count > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-dark-300">{product.rating_avg}</span>
                <span className="text-xs text-dark-500">({product.rating_count})</span>
              </div>
            )}

            {/* Price + Add to Cart */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.compare_at_price && (
                  <span className="text-sm text-dark-500 line-through">
                    {formatPrice(product.compare_at_price, product.currency)}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-gray-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
