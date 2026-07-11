'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Minus, Plus, ChevronRight, Package } from 'lucide-react';
import { Product, Review } from '@/types';
import { formatPrice, getStockStatus, formatDate } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useUIStore } from '@/stores/ui-store';
import ProductCard from '@/components/store/ProductCard';

interface Props {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
}

export default function ProductDetailClient({ product, relatedProducts, reviews }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const toggleWishlist = useWishlistStore(state => state.toggleItem);
  const isInWishlist = useWishlistStore(state => state.isInWishlist(product.id));
  const addToast = useUIStore(state => state.addToast);
  const stockStatus = getStockStatus(product.stock_quantity, product.low_stock_threshold);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Defer persisted store value to prevent hydration mismatch
  const wishlisted = mounted ? isInWishlist : false;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      quantity,
      maxStock: product.stock_quantity,
      currency: product.currency,
    });
    addToast({ message: `${product.name} added to cart`, type: 'success' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="section-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-dark-400 mb-8">
          <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary-400 transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-400 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark-200">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-dark-900800 border border-gray-300 dark:border-dark-700/50">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-dark-600" />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary-500' : 'border-gray-300 dark:border-dark-700 hover:border-gray-300 dark:border-dark-700500'
                    }`}
                  >
                    <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {product.category && (
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            
            {/* Rating */}
            {product.rating_count > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating_avg)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-dark-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-dark-300">{product.rating_avg} ({product.rating_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compare_at_price && (
                <span className="text-xl text-dark-500 line-through">
                  {formatPrice(product.compare_at_price, product.currency)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                stockStatus.color === 'green' ? 'bg-green-500/10 text-green-400' :
                stockStatus.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  stockStatus.color === 'green' ? 'bg-green-400' :
                  stockStatus.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                {stockStatus.label}
              </span>
              {product.stock_quantity > 0 && (
                <span className="text-dark-500 text-sm">({product.stock_quantity} available)</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-700 dark:text-dark-300 leading-relaxed">{product.description}</p>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-300 dark:border-dark-700800/50">
                      <span className="text-dark-400">{key}</span>
                      <span className="text-dark-200 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 pt-4">
              {/* Quantity */}
              <div className="flex items-center gap-2 bg-white dark:bg-dark-900800 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-md hover:bg-white dark:bg-dark-900700 text-dark-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-gray-900 dark:text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="p-2 rounded-md hover:bg-white dark:bg-dark-900700 text-dark-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  addToast({
                    message: wishlisted ? 'Removed from wishlist' : 'Added to wishlist',
                    type: 'info',
                  });
                }}
                className={`p-3 rounded-lg border transition-all ${
                  wishlisted
                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border-gray-300 dark:border-dark-700 text-dark-400 hover:border-primary-500/30 hover:text-primary-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-dark-400 text-sm">{formatDate(review.created_at)}</span>
                  </div>
                  {review.comment && <p className="text-gray-700 dark:text-dark-300">{review.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
