import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/types";
import toast from "react-hot-toast";

interface WishlistStore {
    items: Product[];
    addItem: (item: Product) => void;
    removeItem: (itemId: string) => void;
    hasItem: (itemId: string) => boolean;
    toggle: (item: Product) => void;
}

const useWishlist = create(
    persist<WishlistStore>(
        (set, get) => ({
            items: [],
            addItem: (data: Product) => {
                const existing = get().items.find((item) => item.id === data.id);
                if (existing) return;
                set({ items: [...get().items, data] });
                toast.success("Saved to wishlist");
            },
            removeItem: (itemId: string) => {
                set({ items: get().items.filter((item) => item.id !== itemId) });
                toast.success("Removed from wishlist");
            },
            hasItem: (itemId: string) => {
                return !!get().items.find((item) => item.id === itemId);
            },
            toggle: (data: Product) => {
                const existing = get().items.find((item) => item.id === data.id);
                if (existing) {
                    set({ items: get().items.filter((item) => item.id !== data.id) });
                    toast("Removed from wishlist");
                } else {
                    set({ items: [...get().items, data] });
                    toast.success("Saved to wishlist");
                }
            },
        }),
        {
            name: "wishlist-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useWishlist;
