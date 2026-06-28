import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(params: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  currency: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
}) {
  const { customerEmail, customerName, orderNumber, items, total, currency, shippingAddress, shippingCity, shippingCountry } = params;
  
  const itemsHtml = items.map(item => 
    `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #1e293b;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #1e293b; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #1e293b; text-align: right;">${currency} ${item.price.toFixed(2)}</td>
    </tr>`
  ).join('');

  await resend.emails.send({
    from: 'SogAfrika <orders@sogafrika.com>',
    to: customerEmail,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #06b6d4; font-size: 24px; margin: 0;">SogAfrika</h1>
          <p style="color: #64748b; margin-top: 5px;">Electronic Security & Technology</p>
        </div>
        
        <h2 style="color: #f1f5f9; font-size: 20px;">Order Confirmed!</h2>
        <p>Hi ${customerName},</p>
        <p>Thank you for your order. Here's your order summary:</p>
        
        <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #94a3b8;">Order Number</p>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: 600; color: #06b6d4;">${orderNumber}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #1e293b;">
              <th style="padding: 12px; text-align: left; color: #94a3b8;">Product</th>
              <th style="padding: 12px; text-align: center; color: #94a3b8;">Qty</th>
              <th style="padding: 12px; text-align: right; color: #94a3b8;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; font-weight: 600;">Total</td>
              <td style="padding: 12px; text-align: right; font-weight: 700; color: #06b6d4; font-size: 18px;">${currency} ${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #94a3b8;">Shipping Address</p>
          <p style="margin: 5px 0 0; color: #f1f5f9;">${shippingAddress}<br>${shippingCity}, ${shippingCountry}</p>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin-top: 30px; text-align: center;">
          If you have any questions, contact us at contact@sogafrika.com
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1e293b;">
          <p style="color: #475569; font-size: 12px;">&copy; ${new Date().getFullYear()} SogAfrika. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminOrderNotification(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  currency: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
}) {
  const { orderNumber, customerName, customerEmail, customerPhone, items, total, currency, shippingAddress, shippingCity, shippingCountry } = params;
  
  const adminEmail = process.env.ADMIN_EMAIL || 'contact@sogafrika.com';
  
  const itemsList = items.map(item => 
    `<li>${item.name} x${item.quantity} - ${currency} ${item.price.toFixed(2)}</li>`
  ).join('');

  await resend.emails.send({
    from: 'SogAfrika System <system@sogafrika.com>',
    to: adminEmail,
    subject: `New Order Received - ${orderNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
        <h1 style="color: #06b6d4;">New Order Received!</h1>
        
        <h3>Order: ${orderNumber}</h3>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        
        <h3>Customer Details</h3>
        <ul>
          <li><strong>Name:</strong> ${customerName}</li>
          <li><strong>Email:</strong> ${customerEmail}</li>
          <li><strong>Phone:</strong> ${customerPhone || 'N/A'}</li>
        </ul>
        
        <h3>Delivery Address</h3>
        <p>${shippingAddress}<br>${shippingCity}, ${shippingCountry}</p>
        
        <h3>Items Ordered</h3>
        <ul>${itemsList}</ul>
        
        <h3 style="color: #06b6d4;">Total: ${currency} ${total.toFixed(2)}</h3>
        
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders" style="color: #06b6d4;">View in Admin Dashboard</a></p>
      </div>
    `,
  });
}
