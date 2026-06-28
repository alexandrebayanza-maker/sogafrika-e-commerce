import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/lib/utils';

export async function GET(request: NextRequest) {
  // Use admin client to bypass RLS for order reads (admin dashboard)
  const supabase = createAdminClient();
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  
  let query = supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  const body = await request.json();

  const orderNumber = generateOrderNumber();
  
  const { items, ...orderData } = body;
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ ...orderData, order_number: orderNumber }])
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 400 });
  }

  // Create order items
  if (items && items.length > 0) {
    const orderItems = items.map((item: any) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 });
    }
  }

  return NextResponse.json(order, { status: 201 });
}
