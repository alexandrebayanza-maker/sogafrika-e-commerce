import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const serverSupabase = createServerSupabaseClient();
  const supabase = createAdminClient();
  
  const { data: { session } } = await serverSupabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check admin role from profiles table (used by auth system)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Get total revenue
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total')
    .eq('status', 'paid');
  
  const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

  // Get total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // Get low stock products
  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('*')
    .lte('stock_quantity', 5)
    .eq('is_active', true);

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // Get revenue by day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: dailyOrders } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('status', 'paid')
    .gte('created_at', thirtyDaysAgo.toISOString());

  const revenueByDay: Record<string, number> = {};
  dailyOrders?.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    revenueByDay[date] = (revenueByDay[date] || 0) + parseFloat(order.total);
  });

  const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({
    date,
    revenue,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    totalRevenue,
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    lowStockCount: lowStockProducts?.length || 0,
    recentOrders: recentOrders || [],
    revenueByDay: revenueChart,
  });
}
