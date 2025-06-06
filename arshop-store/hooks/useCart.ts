import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/types";
import toast from "react-hot-toast";

interface CartStore {
    items:  Product[];
    addItem: (item: Product) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
}

const useCart = create(
    persist<CartStore>((set,get) => ({
        items: [],
        addItem: (data: Product) => {
            const currentItems = get().items;
            const existingItem = currentItems.find(item => item.id === data.id);
            if(existingItem){
                return toast("Item already in cart");
            }
            set({ items: [...get().items, data] });
            toast.success("Item added to cart");
        },
        removeItem: (itemId: string) => {
            set({ items: get().items.filter(item => item.id !== itemId) });
            toast.success("Item removed from cart");
        },
        clearCart: () => set({ items: [] }),
    }),
    {
        name: "cart-storage", 
        storage: createJSONStorage(() => localStorage), 
    }
)

)

export default useCart;