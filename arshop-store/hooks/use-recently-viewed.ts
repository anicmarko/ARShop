import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/types";

const MAX_ITEMS = 8;

interface RecentlyViewedStore {
    items: Product[];
    addItem: (product: Product) => void;
    clear: () => void;
}

const useRecentlyViewed = create(
    persist<RecentlyViewedStore>(
        (set, get) => ({
            items: [],
            addItem: (product: Product) => {
                const filtered = get().items.filter((p) => p.id !== product.id);
                set({ items: [product, ...filtered].slice(0, MAX_ITEMS) });
            },
            clear: () => set({ items: [] }),
        }),
        {
            name: "recently-viewed",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useRecentlyViewed;
