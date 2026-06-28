'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, ChevronDown, LogIn, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/shared/Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const cartItems = useCartStore(state => state.totalItems);
  const wishlistItems = useWishlistStore(state => state.items.length);

  // Mark as mounted after first client render to prevent hydration mismatch
  // Zustand persisted stores read from localStorage only on the client,
  // so cart/wishlist counts differ between server (0) and client (persisted).
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUser({
          email: session.user.email || '',
          role: profile?.role || 'user',
        });
      } else {
        setUser(null);
      }
    }

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              email: session.user.email || '',
              role: profile?.role || 'user',
            });
          });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  // Safely read persisted store values only after mount to avoid hydration mismatch
  const cartCount = mounted ? cartItems() : 0;
  const wishlistCount = mounted ? wishlistItems : 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/90 backdrop-blur-xl border-b border-dark-800/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="sm" />
            <span className="font-display text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              SogAfrika
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-dark-300 hover:text-primary-400 hover:bg-primary-500/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <div className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-dark-300 hover:text-primary-400 hover:bg-primary-500/5 transition-all duration-300">
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-dark-900/95 backdrop-blur-xl border border-dark-700/50 shadow-xl py-2"
                  >
                    {PRODUCT_CATEGORIES.map(category => (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        className="block px-4 py-2.5 text-sm text-dark-300 hover:text-primary-400 hover:bg-primary-500/5 transition-all"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Dashboard — visible only to admin users */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname.startsWith('/admin')
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-dark-300 hover:text-primary-400 hover:bg-primary-500/5'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </span>
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-300"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section — Desktop */}
            {user ? (
              <div className="relative hidden md:block"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark-300 hover:text-primary-400 hover:bg-primary-500/5 transition-all">
                  <UserCircle className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-1 w-48 rounded-xl bg-dark-900/95 backdrop-blur-xl border border-dark-700/50 shadow-xl py-2"
                    >
                      <p className="px-4 py-2 text-xs text-dark-500 truncate border-b border-dark-800/50">
                        {user.email}
                      </p>
                      {user.role !== 'admin' && (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-300 hover:text-primary-400 hover:bg-primary-500/5 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          My Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-dark-300 hover:text-red-400 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-dark-300 hover:text-primary-400 hover:bg-primary-500/5 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                Login / Sign up
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-dark-400 hover:text-primary-400 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-dark-800/50 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.href
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-dark-300 hover:text-primary-400 hover:bg-primary-500/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <div className="pt-2 border-t border-dark-800/50">
                  <p className="px-4 py-2 text-xs text-dark-500 uppercase tracking-wider">Categories</p>
                  {PRODUCT_CATEGORIES.map(category => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-dark-400 hover:text-primary-400 transition-all"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth */}
                <div className="pt-2 border-t border-dark-800/50">
                  {user ? (
                    <>
                      {/* Admin Dashboard link — mobile */}
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-primary-400 font-medium hover:bg-primary-500/5 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      {/* Regular user dashboard */}
                      {user.role !== 'admin' && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-dark-300 hover:text-primary-400 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          My Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-dark-300 hover:text-red-400 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/admin/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-primary-400 font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                      Login / Sign up
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
