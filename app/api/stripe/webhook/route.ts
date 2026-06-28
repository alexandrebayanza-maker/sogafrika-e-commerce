import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/resend';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createAdminClient();

    const orderId = session.metadata?.order_id;
    const orderNumber = session.metadata?.order_number;

    if (!orderId) {
      return NextResponse.json({ error: 'No order_id in metadata' }, { status: 400 });
    }

    // Update order status to 'paid'
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_payment_intent: session.payment_intent as string,
      })
      .eq('id', orderId);

    // Get order details with items
    const { data: order } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (order) {
      // Decrement stock for each item
      for (const item of order.items) {
        await supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
      }

      // Prepare email data
      const emailItems = order.items.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.total_price,
      }));

      // Send confirmation email to customer
      try {
        await sendOrderConfirmationEmail({
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          orderNumber: order.order_number,
          items: emailItems,
          total: order.total,
          currency: order.currency,
          shippingAddress: order.shipping_address,
          shippingCity: order.shipping_city,
          shippingCountry: order.shipping_country,
        });
      } catch (emailError) {
        console.error('Failed to send customer email:', emailError);
      }

      // Send notification to admin
      try {
        await sendAdminOrderNotification({
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          items: emailItems,
          total: order.total,
          currency: order.currency,
          shippingAddress: order.shipping_address,
          shippingCity: order.shipping_city,
          shippingCountry: order.shipping_country,
        });
      } catch (emailError) {
        console.error('Failed to send admin email:', emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
