'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Eye, ChevronDown } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/orders${params}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: status as any } : o));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-48"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 dark:border-dark-700/50 bg-white dark:bg-dark-900800/30">
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Order</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Date</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Total</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Status</th>
                <th className="text-right py-3 px-4 text-dark-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-300 dark:border-dark-800/30 hover:bg-white dark:bg-dark-900800/20">
                  <td className="py-3 px-4 text-primary-400 font-mono text-sm">{order.order_number}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-dark-200 text-sm">{order.customer_name}</p>
                      <p className="text-dark-500 text-xs">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-dark-400 text-sm">{formatDateTime(order.created_at)}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium text-sm">{formatPrice(order.total, order.currency)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-white dark:bg-dark-900800 border border-gray-300 dark:border-dark-700 rounded px-2 py-1 text-xs text-dark-200"
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-dark-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-white dark:bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="glass-card max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order {selectedOrder.order_number}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-dark-400 hover:text-gray-900 dark:text-white">
                &times;
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-dark-500 text-xs">Customer</p>
                <p className="text-dark-200">{selectedOrder.customer_name}</p>
                <p className="text-dark-400 text-sm">{selectedOrder.customer_email}</p>
                {selectedOrder.customer_phone && <p className="text-dark-400 text-sm">{selectedOrder.customer_phone}</p>}
              </div>
              <div>
                <p className="text-dark-500 text-xs">Shipping Address</p>
                <p className="text-dark-200">{selectedOrder.shipping_address}</p>
                <p className="text-dark-400 text-sm">{selectedOrder.shipping_city}, {selectedOrder.shipping_country}</p>
              </div>
              {selectedOrder.notes && (
                <div>
                  <p className="text-dark-500 text-xs">Notes</p>
                  <p className="text-dark-300 text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              {selectedOrder.items && (
                <div>
                  <p className="text-dark-500 text-xs mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-300 dark:border-dark-800/50">
                        <div>
                          <p className="text-dark-200 text-sm">{item.product_name}</p>
                          <p className="text-dark-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm font-medium">{formatPrice(item.total_price, selectedOrder.currency)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-3 border-t border-gray-300 dark:border-dark-700/50 flex justify-between">
                <span className="text-gray-900 dark:text-white font-semibold">Total</span>
                <span className="text-primary-400 font-bold text-lg">{formatPrice(selectedOrder.total, selectedOrder.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
