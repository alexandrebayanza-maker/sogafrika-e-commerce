'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Loader2, Plus, Trash2 } from 'lucide-react';
import { Category, Product } from '@/types';
import { CURRENCIES } from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0.01),
  compare_at_price: z.number().optional().nullable(),
  currency: z.string().default('USD'),
  category_id: z.string().optional().nullable(),
  stock_quantity: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0),
  is_active: z.boolean(),
  featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch('/api/categories'),
        ]);
        const product: Product = await prodRes.json();
        const cats = await catRes.json();
        
        setCategories(cats);
        setImages(product.images || []);
        setSpecs(
          product.specifications
            ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
            : []
        );
        reset({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price,
          compare_at_price: product.compare_at_price,
          currency: product.currency,
          category_id: product.category_id,
          stock_quantity: product.stock_quantity,
          low_stock_threshold: product.low_stock_threshold,
          is_active: product.is_active,
          featured: product.featured,
        });
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.urls) setImages(prev => [...prev, ...data.urls]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      const specifications: Record<string, string> = {};
      specs.forEach(s => { if (s.key && s.value) specifications[s.key] = s.value; });

      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images,
          specifications,
          category_id: data.category_id || null,
          compare_at_price: data.compare_at_price || null,
        }),
      });

      if (res.ok) router.push('/admin/products');
      else {
        const err = await res.json();
        alert(err.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1">Name *</label>
              <input {...register('name')} className="input-field" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">Slug *</label>
              <input {...register('slug')} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-dark-300 text-sm mb-1">Description</label>
            <textarea {...register('description')} className="input-field resize-none" rows={4} />
          </div>
          <div>
            <label className="block text-dark-300 text-sm mb-1">Category</label>
            <select {...register('category_id')} className="input-field">
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1">Price *</label>
              <input {...register('price', { valueAsNumber: true })} type="number" step="0.01" className="input-field" />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">Compare at Price</label>
              <input {...register('compare_at_price', { valueAsNumber: true })} type="number" step="0.01" className="input-field" />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">Currency</label>
              <select {...register('currency')} className="input-field">
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1">Stock Quantity</label>
              <input {...register('stock_quantity', { valueAsNumber: true })} type="number" className="input-field" />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">Low Stock Threshold</label>
              <input {...register('low_stock_threshold', { valueAsNumber: true })} type="number" className="input-field" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-dark-300 cursor-pointer">
              <input {...register('is_active')} type="checkbox" className="w-4 h-4 rounded" />
              Active
            </label>
            <label className="flex items-center gap-2 text-dark-300 cursor-pointer">
              <input {...register('featured')} type="checkbox" className="w-4 h-4 rounded" />
              Featured
            </label>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Images</h2>
          <div className="flex flex-wrap gap-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-dark-700">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-gray-900 dark:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-dark-700600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/50 transition-colors">
              {uploading ? <Loader2 className="w-5 h-5 text-dark-400 animate-spin" /> : <Upload className="w-5 h-5 text-dark-400" />}
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Specifications</h2>
            <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-primary-400 text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {specs.map((spec, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input value={spec.key} onChange={(e) => { const u = [...specs]; u[idx].key = e.target.value; setSpecs(u); }} className="input-field flex-1" placeholder="Key" />
              <input value={spec.value} onChange={(e) => { const u = [...specs]; u[idx].value = e.target.value; setSpecs(u); }} className="input-field flex-1" placeholder="Value" />
              <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== idx))} className="p-2 text-dark-400 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Update Product'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
