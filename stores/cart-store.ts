import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: CartItem) => {
        const items = get().items;
        const existingItem = items.find(i => i.productId === item.productId);
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + item.quantity, item.maxStock);
          set({
            items: items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (productId: string) => {
        set({ items: get().items.filter(i => i.productId !== productId) });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          set({ items: get().items.filter(i => i.productId !== productId) });
          return;
        }
        set({
          items: get().items.map(i =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'sogafrika-cart',
    }
  )
);
