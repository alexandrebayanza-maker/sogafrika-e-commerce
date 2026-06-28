import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

async function getRelatedProducts(categoryId: string, productId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .neq('id', productId)
    .eq('is_active', true)
    .limit(4);
  return data || [];
}

async function getReviews(productId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at SogAfrika`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug);
  
  if (!product) notFound();

  const [relatedProducts, reviews] = await Promise.all([
    product.category_id ? getRelatedProducts(product.category_id, product.id) : [],
    getReviews(product.id),
  ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
    />
  );
}
