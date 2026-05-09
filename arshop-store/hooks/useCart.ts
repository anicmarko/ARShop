import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

import { CartItem, Product } from "@/types";
import useCartDrawer from "@/hooks/use-cart-drawer";

interface CartStore {
    items: CartItem[];
    addItem: (product: Product, sizeId: string, sizeName: string) => void;
    removeItem: (productId: string, sizeId: string) => void;
    updateQuantity: (productId: string, sizeId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
}

const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],

            addItem: (product: Product, sizeId: string, sizeName: string) => {
                useCartDrawer.getState().onOpen();
                const sizeStock = product.sizes.find((s) => s.sizeId === sizeId)?.stock ?? 0;
                const existing = get().items.find(
                    (i) => i.product.id === product.id && i.sizeId === sizeId
                );
                if (existing) {
                    if (existing.quantity >= sizeStock) {
                        toast.error(`Only ${sizeStock} in stock for size ${sizeName}`);
                        return;
                    }
                    set({
                        items: get().items.map((i) =>
                            i.product.id === product.id && i.sizeId === sizeId
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                    toast.success("Quantity updated");
                } else {
                    if (sizeStock === 0) {
                        toast.error(`Size ${sizeName} is out of stock`);
                        return;
                    }
                    set({ items: [...get().items, { product, sizeId, sizeName, quantity: 1 }] });
                    toast.success("Added to cart");
                }
            },

            removeItem: (productId: string, sizeId: string) => {
                set({
                    items: get().items.filter(
                        (i) => !(i.product.id === productId && i.sizeId === sizeId)
                    ),
                });
                toast.success("Removed from cart");
            },

            updateQuantity: (productId: string, sizeId: string, quantity: number) => {
                if (quantity <= 0) {
                    set({
                        items: get().items.filter(
                            (i) => !(i.product.id === productId && i.sizeId === sizeId)
                        ),
                    });
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.product.id === productId && i.sizeId === sizeId
                                ? { ...i, quantity }
                                : i
                        ),
                    });
                }
            },

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: "cart-storage-v3",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;
