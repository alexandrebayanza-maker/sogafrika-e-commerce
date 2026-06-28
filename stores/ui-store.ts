import { create } from 'zustand';

interface UIStore {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  toasts: Toast[];
  setMobileMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const useUIStore = create<UIStore>((set, get) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  toasts: [],

  setMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),
  setCartOpen: (open: boolean) => set({ isCartOpen: open }),

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    set({ toasts: [...get().toasts, newToast] });
    
    // Auto-remove after duration
    setTimeout(() => {
      get().removeToast(id);
    }, toast.duration || 3000);
  },

  removeToast: (id: string) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },
}));
