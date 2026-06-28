'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShoppingBag, Package, User } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  full_name: string;
  email: string;
  role: string;
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, role')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-dark-800/50 bg-dark-950/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="font-display text-lg font-bold text-white">SogAfrika</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white">
              Welcome, <span className="gradient-text">{profile?.full_name || 'User'}</span>
            </h1>
            <p className="text-dark-400 mt-2">
              Here is your personal dashboard. You are logged in as <span className="text-dark-300 font-medium">{profile?.role}</span>.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6">
              <div className="inline-flex p-3 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-3">
                <User className="w-6 h-6" />
              </div>
              <p className="text-dark-400 text-sm">Account</p>
              <p className="text-lg font-semibold text-white mt-1">{profile?.email}</p>
            </div>
            <div className="glass-card p-6">
              <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-dark-400 text-sm">My Orders</p>
              <p className="text-lg font-semibold text-white mt-1">View order history</p>
            </div>
            <div className="glass-card p-6">
              <div className="inline-flex p-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 mb-3">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-dark-400 text-sm">Wishlist</p>
              <p className="text-lg font-semibold text-white mt-1">Saved items</p>
            </div>
          </div>

          {/* Access notice */}
          {profile?.role !== 'admin' && (
            <div className="glass-card p-6 border-yellow-500/20">
              <p className="text-yellow-400 text-sm font-medium mb-1">Notice</p>
              <p className="text-dark-300 text-sm">
                You are signed in as a regular user. If you need admin access, please contact the SogAfrika team.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
