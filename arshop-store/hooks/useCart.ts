import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

import { CartItem, Product } from "@/types";
import useCartDrawer from "@/hooks/use-cart-drawer";

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
}

const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],

            addItem: (product: Product) => {
                useCartDrawer.getState().onOpen();
                const existing = get().items.find((i) => i.product.id === product.id);
                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.product.id === product.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                    toast.success("Quantity updated");
                } else {
                    set({ items: [...get().items, { product, quantity: 1 }] });
                    toast.success("Added to cart");
                }
            },

            removeItem: (productId: string) => {
                set({ items: get().items.filter((i) => i.product.id !== productId) });
                toast.success("Removed from cart");
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    set({ items: get().items.filter((i) => i.product.id !== productId) });
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.product.id === productId ? { ...i, quantity } : i
                        ),
                    });
                }
            },

            clearCart: () => set({ items: [] }),

            totalItems: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: "cart-storage-v2",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;
