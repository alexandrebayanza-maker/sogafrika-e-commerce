import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { SITE_CONFIG, PRODUCT_CATEGORIES } from '@/lib/constants';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/50">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="font-display text-xl font-bold text-white">SogAfrika</span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed">
              Premium electronic security and technology solutions for homes and businesses across Africa and beyond.
            </p>
            <div className="flex gap-3">
              <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">All Products</Link></li>
              <li><Link href="/#about" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">About Us</Link></li>
              <li><Link href="/#contact" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/cart" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Shopping Cart</Link></li>
              <li><Link href="/wishlist" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {PRODUCT_CATEGORIES.map(category => (
                <li key={category.slug}>
                  <Link href={`/products?category=${category.slug}`} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-dark-400 text-sm">DRC, Goma</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a href={`tel: +243990305116`} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                  {+243990305116}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.company.email}`} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                  {SITE_CONFIG.company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-800/50">
        <div className="section-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            &copy; {new Date().getFullYear()} SogAfrika. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-dark-500 hover:text-dark-300 text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-dark-500 hover:text-dark-300 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
