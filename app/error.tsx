'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 p-4">
      <div className="text-center space-y-6">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h2>
        <p className="text-dark-400">An unexpected error occurred.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
