import { create } from "zustand";

interface CartDrawerStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useCartDrawer = create<CartDrawerStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useCartDrawer;
