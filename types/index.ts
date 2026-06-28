// ============ Categories ============
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  product_count?: number;
}

// ============ Products ============
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: Record<string, string> | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  category_id: string | null;
  category?: Category;
  images: string[];
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  featured: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

// ============ Orders ============
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  notes: string | null;
  subtotal: number;
  total: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// ============ Cart ============
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
  currency: string;
}

// ============ Wishlist ============
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

// ============ Reviews ============
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name?: string;
}

// ============ Admin ============
export interface AdminProfile {
  id: string;
  role: string;
  created_at: string;
}

// ============ Customer ============
export interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
}

// ============ API Responses ============
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// ============ Checkout ============
export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
  currency: string;
}

// ============ Analytics ============
export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: Order[];
  revenueByDay: { date: string; revenue: number }[];
}
