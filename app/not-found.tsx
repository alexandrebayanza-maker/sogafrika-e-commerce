import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900950 p-4">
      <div className="text-center space-y-6">
        <Logo size="lg" className="mx-auto opacity-60" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="text-dark-400 text-lg">Page not found</p>
        <Link href="/" className="btn-primary inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}
