'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Category } from '@/types';
import { generateSlug } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setForm({ name: '', slug: '', description: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                className="input-field"
                placeholder="Category name"
                required
              />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-dark-300 text-sm mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 dark:border-dark-700/50 bg-white dark:bg-dark-900800/30">
              <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Name</th>
              <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Slug</th>
              <th className="text-left py-3 px-4 text-dark-400 text-sm font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b border-gray-300 dark:border-dark-800/30 hover:bg-white dark:bg-dark-900800/20">
                <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{cat.name}</td>
                <td className="py-3 px-4 text-dark-400 font-mono text-sm">{cat.slug}</td>
                <td className="py-3 px-4 text-dark-400 text-sm">{cat.description || '-'}</td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} className="py-8 text-center text-dark-500">No categories</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
