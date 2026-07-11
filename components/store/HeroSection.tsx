'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { DISPLAY_STATS } from '@/config/stats';
import Logo from '@/components/shared/Logo';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white dark:bg-dark-900950">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950" />
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="section-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">Advanced Security Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Protecting{' '}
              <span className="gradient-text">What Matters</span>{' '}
              Most
            </h1>
            
            <p className="text-lg text-dark-300 leading-relaxed max-w-lg">
              SogAfrika delivers premium electronic security and technology devices. 
              From CCTV surveillance to biometric access systems, we provide cutting-edge 
              protection for homes and businesses across East-Africa.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products" className="btn-secondary inline-flex items-center gap-2">
                View Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-300 dark:border-dark-700800/50">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{DISPLAY_STATS.products.value}</p>
                <p className="text-dark-400 text-sm">{DISPLAY_STATS.products.label}</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{DISPLAY_STATS.clients.value}</p>
                <p className="text-dark-400 text-sm">{DISPLAY_STATS.clients.label}</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{DISPLAY_STATS.experience.value}</p>
                <p className="text-dark-400 text-sm">{DISPLAY_STATS.experience.label}</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Central logo */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center animate-glow-pulse border border-primary-500/20">
                <div className="w-60 h-60 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center border border-primary-500/10">
                  <Logo size="xl" />
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-white dark:bg-dark-900800/80 backdrop-blur border border-primary-500/20 flex items-center justify-center animate-float">
                <span className="text-2xl">📹</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-white dark:bg-dark-900800/80 backdrop-blur border border-secondary-500/20 flex items-center justify-center animate-float delay-1000">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 rounded-xl bg-white dark:bg-dark-900800/80 backdrop-blur border border-primary-500/20 flex items-center justify-center animate-float delay-500">
                <span className="text-2xl">🌐</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
