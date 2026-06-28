export const SITE_CONFIG = {
  name: 'SogAfrika',
  description: 'Premium Electronic Security & Technology Solutions',
  tagline: 'Protecting What Matters Most',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL || 'contact@sogafrika.com',
  company: {
    phone: '+225 07 00 00 00 00',
    email: 'contact@sogafrika.com',
    address: 'Abidjan, Côte d\'Ivoire',
  },
  social: {
    facebook: 'https://facebook.com/sogafrika',
    instagram: 'https://instagram.com/sogafrika',
    twitter: 'https://twitter.com/sogafrika',
    linkedin: 'https://linkedin.com/company/sogafrika',
  },
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

export const PRODUCT_CATEGORIES = [
  { name: 'CCTV Cameras', slug: 'cctv-cameras', icon: 'Camera' },
  { name: 'Fire Safety', slug: 'fire-safety', icon: 'Flame' },
  { name: 'Networking', slug: 'networking', icon: 'Network' },
  { name: 'Biometric Access', slug: 'biometric-access', icon: 'Fingerprint' },
  { name: 'Alarm Systems', slug: 'alarm-systems', icon: 'Bell' },
  { name: 'Surveillance', slug: 'surveillance', icon: 'Eye' },
] as const;

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'processing', label: 'Processing', color: 'blue' },
  { value: 'shipped', label: 'Shipped', color: 'purple' },
  { value: 'delivered', label: 'Delivered', color: 'emerald' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const;

export const ITEMS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

export const COUNTRIES = [
  'Côte d\'Ivoire',
  'Senegal',
  'Mali',
  'Burkina Faso',
  'Guinea',
  'Cameroon',
  'Nigeria',
  'Ghana',
  'Togo',
  'Benin',
  'France',
  'United States',
  'United Kingdom',
  'Canada',
  'Other',
] as const;
