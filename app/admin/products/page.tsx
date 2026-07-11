'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getStockStatus } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-12"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 dark:border-dark-700700/50 bg-white dark:bg-dark-900800/30">
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Product</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Category</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Price</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Stock</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Status</th>
                <th className="text-right py-3 px-4 text-dark-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => {
                const stock = getStockStatus(product.stock_quantity, product.low_stock_threshold);
                return (
                  <tr key={product.id} className="border-b border-gray-300 dark:border-dark-700800/30 hover:bg-white dark:bg-dark-900800/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-dark-900800 flex-shrink-0">
                          {product.images[0] ? (
                            <Image src={product.images[0]} alt="" width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-white dark:bg-dark-900700" />
                          )}
                        </div>
                        <span className="text-dark-200 font-medium text-sm truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-dark-400 text-sm">{product.category?.name || '-'}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white text-sm font-medium">{formatPrice(product.price, product.currency)}</td>
                    <td className="py-3 px-4 text-dark-300 text-sm">{product.stock_quantity}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        stock.color === 'green' ? 'bg-green-500/10 text-green-400' :
                        stock.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {stock.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-dark-500">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
