import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  category?: string;
  stock: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  zipcode: string;
}

interface CartState {
  items: CartItem[];
  shippingInfo: ShippingInfo | null;
  addItem: (product: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      shippingInfo: null,
      addItem: (product) =>
        set((state: CartState) => {
          window.dispatchEvent(new Event("cartUpdate"));

          const existing = state.items.find(
            (i: CartItem) => i.id === product.id,
          );
          if (existing) {
            if (existing.quantity < existing.stock) {
              return {
                items: state.items.map((i: CartItem) =>
                  i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
                ),
              };
            }
            return state;
          }
          if (product.stock > 0) {
            return { items: [...state.items, { ...product, quantity: 1 }] };
          }
          return state;
        }),
      updateQuantity: (id: string, newQuantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item,
          ),
        })),
      removeItem: (id) =>
        set((state: CartState) => ({
          items: state.items.filter((i: CartItem) => i.id !== id),
        })),
      setShippingInfo: (info) => set({ shippingInfo: info }),
      clearCart: () => set({ items: [], shippingInfo: null }),
    }),
    { name: "cart-storage" },
  ),
);
