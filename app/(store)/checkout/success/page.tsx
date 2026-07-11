import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface Props {
  searchParams: { order?: string };
}

export default function CheckoutSuccessPage({ searchParams }: Props) {
  const orderNumber = searchParams.order || 'N/A';

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h1>
        
        <p className="text-gray-700 dark:text-dark-300">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <div className="glass-card p-6 space-y-3">
          <div className="flex items-center justify-center gap-2 text-primary-400">
            <Package className="w-5 h-5" />
            <span className="font-medium">Order Number</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{orderNumber}</p>
          <p className="text-gray-600 dark:text-dark-400 text-sm">
            A confirmation email has been sent to your email address.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
