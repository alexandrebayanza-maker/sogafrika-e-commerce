'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Product } from '@/types';
import { getStockStatus } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=200');
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Failed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter(p => {
    if (filter === 'low') return p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
    if (filter === 'out') return p.stock_quantity === 0;
    return true;
  });

  const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Inventory Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`glass-card p-4 text-left transition-all ${filter === 'all' ? 'border-primary-500/50' : ''}`}
        >
          <Package className="w-6 h-6 text-primary-400 mb-2" />
          <p className="text-2xl font-bold text-white">{products.length}</p>
          <p className="text-dark-400 text-sm">Total Products</p>
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`glass-card p-4 text-left transition-all ${filter === 'low' ? 'border-yellow-500/50' : ''}`}
        >
          <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-white">{lowStockCount}</p>
          <p className="text-dark-400 text-sm">Low Stock</p>
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`glass-card p-4 text-left transition-all ${filter === 'out' ? 'border-red-500/50' : ''}`}
        >
          <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
          <p className="text-2xl font-bold text-white">{outOfStockCount}</p>
          <p className="text-dark-400 text-sm">Out of Stock</p>
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700/50 bg-dark-800/30">
              <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Product</th>
              <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Stock</th>
              <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Threshold</th>
              <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => {
              const stock = getStockStatus(product.stock_quantity, product.low_stock_threshold);
              return (
                <tr key={product.id} className="border-b border-dark-800/30 hover:bg-dark-800/20">
                  <td className="py-3 px-4 text-dark-200 text-sm">{product.name}</td>
                  <td className="py-3 px-4 text-white font-medium text-sm">{product.stock_quantity}</td>
                  <td className="py-3 px-4 text-dark-400 text-sm">{product.low_stock_threshold}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      stock.color === 'green' ? 'bg-green-500/10 text-green-400' :
                      stock.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{stock.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
