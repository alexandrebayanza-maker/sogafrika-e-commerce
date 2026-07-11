'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { Product, PaginatedResponse } from '@/types';
import { SORT_OPTIONS, PRODUCT_CATEGORIES, ITEMS_PER_PAGE } from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { debounce } from '@/lib/utils';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', String(ITEMS_PER_PAGE));
    if (currentSearch) params.set('search', currentSearch);
    if (currentCategory) params.set('category', currentCategory);
    if (currentSort) params.set('sort', currentSort);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentSearch, currentCategory, currentSort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const debouncedSearch = useMemo(
  () =>
    debounce((value: string) => {
      updateParams('search', value);
    }, 500),
  [searchParams]
  );

  return (
    <div className="min-h-screen py-8">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Our <span className="gradient-text">Products</span>
          </h1>
          <p className="text-dark-400">
            {total} products available
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={currentSearch}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => updateParams('sort', e.target.value)}
            className="input-field w-full md:w-48"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-secondary flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="glass-card p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-white font-semibold">Filters</h3>
                {currentCategory && (
                  <button
                    onClick={() => updateParams('category', '')}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {/* Categories */}
              <div>
                <h4 className="text-dark-300 text-sm font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {PRODUCT_CATEGORIES.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => updateParams('category', cat.slug === currentCategory ? '' : cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentCategory === cat.slug
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'text-dark-400 hover:text-dark-200 hover:bg-white dark:bg-dark-900800/50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-dark-400 text-lg mb-4">No products found</p>
                <button
                  onClick={() => router.push('/products')}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => updateParams('page', String(currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-dark-900800 text-dark-300 hover:bg-white dark:bg-dark-900700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateParams('page', String(idx + 1))}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === idx + 1
                            ? 'bg-primary-500 text-gray-900 dark:text-white'
                            : 'bg-white dark:bg-dark-900800 text-dark-300 hover:bg-white dark:bg-dark-900700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => updateParams('page', String(currentPage + 1))}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-dark-900800 text-dark-300 hover:bg-white dark:bg-dark-900700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
