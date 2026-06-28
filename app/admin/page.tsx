'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, ShoppingBag, Package, AlertTriangle, LogOut } from 'lucide-react';
import { SalesAnalytics } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Admin');
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        if (profile?.full_name) setUserName(profile.full_name);
      }

      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="gradient-text">{userName}</span>
          </h1>
          <p className="text-dark-400 mt-1">Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Total Revenue"
          value={formatPrice(analytics?.totalRevenue || 0, 'USD')}
          color="primary"
        />
        <StatCard
          icon={<ShoppingBag className="w-6 h-6" />}
          label="Total Orders"
          value={String(analytics?.totalOrders || 0)}
          color="blue"
        />
        <StatCard
          icon={<Package className="w-6 h-6" />}
          label="Total Products"
          value={String(analytics?.totalProducts || 0)}
          color="green"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Low Stock"
          value={String(analytics?.lowStockCount || 0)}
          color="yellow"
        />
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Order</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Date</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Total</th>
                <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.recentOrders?.map(order => (
                <tr key={order.id} className="border-b border-dark-800/30 hover:bg-dark-800/20">
                  <td className="py-3 px-4 text-primary-400 font-mono text-sm">{order.order_number}</td>
                  <td className="py-3 px-4 text-dark-200 text-sm">{order.customer_name}</td>
                  <td className="py-3 px-4 text-dark-400 text-sm">{formatDate(order.created_at)}</td>
                  <td className="py-3 px-4 text-white font-medium text-sm">{formatPrice(order.total, order.currency)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
              {(!analytics?.recentOrders || analytics.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-dark-500">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  return (
    <div className="glass-card p-6">
      <div className={`inline-flex p-3 rounded-xl border ${colors[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-dark-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    paid: 'bg-green-500/10 text-green-400',
    processing: 'bg-blue-500/10 text-blue-400',
    shipped: 'bg-purple-500/10 text-purple-400',
    delivered: 'bg-emerald-500/10 text-emerald-400',
    cancelled: 'bg-red-500/10 text-red-400',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}
