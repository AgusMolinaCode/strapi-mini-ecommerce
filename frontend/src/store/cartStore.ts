import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/interface';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: {
    id: number;
    documentId: string;
    titulo: string;
    precio: number;
    stock: number;
    imagen: string;
    slug: string;
  }, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);

        if (existingItem) {
          // Update quantity if item exists, but don't exceed stock
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            product.stock
          );
          set({
            items: currentItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          // Add new item to cart
          const validQuantity = Math.min(quantity, product.stock);
          set({
            items: [
              ...currentItems,
              {
                ...product,
                quantity: validQuantity,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item => {
            if (item.id === id) {
              // Don't exceed available stock
              const validQuantity = Math.min(quantity, item.stock);
              return { ...item, quantity: validQuantity };
            }
            return item;
          }),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        );
      },
    }),
    {
      name: 'fitpro-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
