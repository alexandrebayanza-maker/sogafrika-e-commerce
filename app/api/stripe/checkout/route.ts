import { NextRequest, NextResponse } from 'next/server';
import { stripe, getStripeAmountForCurrency } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo, currency = 'usd' } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const orderNumber = generateOrderNumber();

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const total = subtotal; // Add shipping/tax logic here if needed

    // Create order in database with 'pending' status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_email: customerInfo.email,
        customer_name: customerInfo.fullName,
        customer_phone: customerInfo.phone || null,
        shipping_address: customerInfo.address,
        shipping_city: customerInfo.city,
        shipping_country: customerInfo.country,
        notes: customerInfo.notes || null,
        subtotal,
        total,
        currency: currency.toUpperCase(),
        status: 'pending',
      }])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);

    // Create Stripe Checkout Session
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: getStripeAmountForCurrency(item.price, currency),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true`,
      customer_email: customerInfo.email,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
      },
    });

    // Update order with Stripe session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({ url: session.url, orderNumber });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
