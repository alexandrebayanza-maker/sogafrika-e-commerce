import Link from 'next/link';
import Image from 'next/image';
import { Camera, Flame, Network, Fingerprint, Bell, Eye, ArrowRight, Award, Clock, Users, Mail, Phone, MapPin, Package } from 'lucide-react';
import HeroSection from '@/components/store/HeroSection';
import TestimonialCarousel from '@/components/store/TestimonialCarousel';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProductCard from '@/components/store/ProductCard';
import { SITE_STATS } from '@/config/stats';
import Logo from '@/components/shared/Logo';

const categoryIcons: Record<string, React.ReactNode> = {
  'cctv-cameras': <Camera className="w-8 h-8" />,
  'fire-safety': <Flame className="w-8 h-8" />,
  'networking': <Network className="w-8 h-8" />,
  'biometric-access': <Fingerprint className="w-8 h-8" />,
  'alarm-systems': <Bell className="w-8 h-8" />,
  'surveillance': <Eye className="w-8 h-8" />,
};

async function getFeaturedProducts() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('featured', true)
    .eq('is_active', true)
    .limit(8);
  return data || [];
}

async function getCategories() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  return data || [];
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="page-section">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Product Categories</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Explore our comprehensive range of electronic security and technology solutions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-dark-900/50 border border-dark-800/50 hover:border-primary-500/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-all">
                  {categoryIcons[category.slug] || <Package className="w-8 h-8" />}
                </div>
                <span className="text-sm font-medium text-dark-300 group-hover:text-primary-400 text-center transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-section bg-dark-900/30">
        <div className="section-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Featured <span className="gradient-text">Products</span>
              </h2>
              <p className="text-dark-400">Top-rated security solutions handpicked for you</p>
            </div>
            <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
          <div className="md:hidden text-center mt-8">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="page-section">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                About <span className="gradient-text">SogAfrika</span>
              </h2>
              <p className="text-dark-300 leading-relaxed">
                SogAfrika is a leading provider of electronic security and technology solutions in EAst-Africa. 
                With over {SITE_STATS.experienceYears} years of experience, we specialize in delivering cutting-edge surveillance systems, 
                fire safety equipment, networking infrastructure, and biometric access control for businesses 
                and residences.
              </p>
              <p className="text-dark-300 leading-relaxed">
                Our mission is to make advanced security technology accessible and reliable for everyone. 
                We partner with world-class manufacturers to bring you the best products at competitive prices, 
                backed by professional installation and dedicated after-sales support.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-900/50 border border-dark-800/50">
                  <Award className="w-8 h-8 text-primary-400" />
                  <div>
                    <p className="text-white font-semibold">Certified</p>
                    <p className="text-dark-400 text-sm">Quality Products</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-900/50 border border-dark-800/50">
                  <Clock className="w-8 h-8 text-primary-400" />
                  <div>
                    <p className="text-white font-semibold">24/7</p>
                    <p className="text-dark-400 text-sm">Support Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-900/50 border border-dark-800/50">
                  <Image src="/logo.png" alt="SOGAfrika" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-white font-semibold">Warranty</p>
                    <p className="text-dark-400 text-sm">On All Products</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-900/50 border border-dark-800/50">
                  <Users className="w-8 h-8 text-primary-400" />
                  <div>
                    <p className="text-white font-semibold">Expert</p>
                    <p className="text-dark-400 text-sm">Technical Team</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <Logo size="xl" className="mx-auto mb-4" />
                  <p className="text-2xl font-display font-bold text-white">SogAfrika</p>
                  <p className="text-dark-400 mt-2">Security & Technology Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* Contact Section */}
      <section id="contact" className="page-section">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Have questions about our products or need a custom security solution? We&apos;re here to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className="input-field" />
                  <input type="email" placeholder="Your Email" className="input-field" />
                </div>
                <input type="text" placeholder="Subject" className="input-field" />
                <textarea placeholder="Your Message" rows={5} className="input-field resize-none" />
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-dark-900/50 border border-dark-800/50">
                <div className="p-3 rounded-xl bg-primary-500/10">
                  <MapPin className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Our Location</h3>
                  <p className="text-dark-400">Goma, DRC</p>
                  <p className="text-dark-400">Goma, North Kivu</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl bg-dark-900/50 border border-dark-800/50">
                <div className="p-3 rounded-xl bg-primary-500/10">
                  <Phone className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <p className="text-dark-400">+243 971 821 402</p>
                  <p className="text-dark-400">Mon - Sat: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl bg-dark-900/50 border border-dark-800/50">
                <div className="p-3 rounded-xl bg-primary-500/10">
                  <Mail className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-dark-400">contact@sogafrika.com</p>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
