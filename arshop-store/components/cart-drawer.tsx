"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Loader2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

import useCartDrawer from "@/hooks/use-cart-drawer";
import useCart from "@/hooks/useCart";
import Currency from "@/components/ui/currency";

const FREE_SHIPPING_THRESHOLD = 5000;

const CartDrawer = () => {
    const { isOpen, onClose } = useCartDrawer();
    const cart = useCart();
    const router = useRouter();
    const { user, isSignedIn } = useUser();

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => setMounted(true), []);

    const subtotal = cart.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
    const totalQty = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

    const onCheckout = async () => {
        if (!isSignedIn) {
            onClose();
            router.push("/sign-in");
            return;
        }
        try {
            setLoading(true);
            const cartItems = cart.items.map(({ product, sizeId, quantity }) => ({
                productId: product.id,
                sizeId,
                quantity,
            }));
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                cartItems,
                userId: user?.id,
                email: user?.primaryEmailAddress?.emailAddress,
                name: user?.fullName ?? user?.firstName,
            });
            window.location.href = res.data.url;
        } catch {
            toast.error("Greška pri plaćanju. Pokušajte ponovo.");
        } finally {
            setLoading(false);
        }
    };

    const goToCart = () => {
        onClose();
        router.push("/cart");
    };

    return (
        <Dialog open={isOpen && mounted} as="div" className="relative z-50" onClose={onClose}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <DialogPanel className="pointer-events-auto w-screen max-w-md">
                            <div className="flex h-full flex-col bg-white dark:bg-zinc-950 shadow-2xl border-l border-gray-200 dark:border-zinc-800">

                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
                                    <div className="flex items-center gap-2.5">
                                        <ShoppingBag size={18} className="text-gray-700 dark:text-zinc-300" aria-hidden="true" />
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">Korpa</h2>
                                        {mounted && totalQty > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold">
                                                {totalQty > 99 ? "99+" : totalQty}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        aria-label="Zatvori korpu"
                                        className="p-2 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Free shipping bar */}
                                {mounted && (
                                    <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
                                        {freeShipping ? (
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center">
                                                🎉 Besplatna dostava je otključana!
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 text-center">
                                                Dodaj još{" "}
                                                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                                                    {remaining.toLocaleString("sr-RS")} RSD
                                                </span>{" "}
                                                za besplatnu dostavu
                                            </p>
                                        )}
                                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                            <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                )}

                                {/* Items */}
                                <div className="flex-1 overflow-y-auto px-5 py-4">
                                    {!mounted || cart.items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                                <ShoppingBag size={28} className="text-gray-300 dark:text-zinc-600" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-zinc-100 mb-1">Korpa je prazna</p>
                                                <p className="text-sm text-gray-400 dark:text-zinc-500">Dodaj nešto i kreni.</p>
                                            </div>
                                            <button onClick={onClose} className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline underline-offset-2">
                                                Nastavi kupovinu
                                            </button>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-100 dark:divide-zinc-800 -mx-1">
                                            {cart.items.map(({ product, sizeId, sizeName, quantity }) => {
                                                const sizeStock = product.sizes.find((s) => s.sizeId === sizeId)?.stock ?? 0;
                                                return (
                                                    <li key={`${product.id}-${sizeId}`} className="flex gap-4 py-4 px-1">
                                                        <div
                                                            className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 cursor-pointer"
                                                            onClick={() => { onClose(); router.push(`/product/${product.id}`); }}
                                                        >
                                                            {product.images?.[0]?.url && (
                                                                <Image fill src={product.images[0].url} alt={product.name} sizes="80px" className="object-cover" />
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate leading-snug">{product.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {product.color?.value && (
                                                                    <span className="h-3 w-3 rounded-full border border-gray-300 dark:border-zinc-600 shrink-0" style={{ backgroundColor: product.color.value }} title={product.color.name} />
                                                                )}
                                                                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">
                                                                    {product.color?.name}{sizeName ? ` · ${sizeName}` : ""}
                                                                </p>
                                                            </div>

                                                            <div className="mt-2 flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-1 rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-0.5">
                                                                    <button
                                                                        onClick={() => cart.updateQuantity(product.id, sizeId, quantity - 1)}
                                                                        aria-label="Smanji količinu"
                                                                        className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-40"
                                                                        disabled={quantity <= 1}
                                                                    >
                                                                        <Minus size={11} />
                                                                    </button>
                                                                    <span className="w-6 text-center text-xs font-semibold text-gray-900 dark:text-zinc-100 tabular-nums">{quantity}</span>
                                                                    <button
                                                                        onClick={() => cart.updateQuantity(product.id, sizeId, quantity + 1)}
                                                                        aria-label="Povećaj količinu"
                                                                        disabled={quantity >= sizeStock}
                                                                        className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-40"
                                                                    >
                                                                        <Plus size={11} />
                                                                    </button>
                                                                </div>
                                                                <Currency value={Number(product.price) * quantity} />
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => cart.removeItem(product.id, sizeId)}
                                                            aria-label={`Ukloni ${product.name}`}
                                                            className="self-start mt-1 p-1.5 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>

                                {/* Footer */}
                                {mounted && cart.items.length > 0 && (
                                    <div className="border-t border-gray-200 dark:border-zinc-800 px-5 py-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500 dark:text-zinc-400">Ukupno ({totalQty} kom)</p>
                                            <Currency value={subtotal} />
                                        </div>
                                        <button
                                            onClick={onCheckout}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 text-sm font-semibold hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            {loading ? <><Loader2 size={15} className="animate-spin" /> Preusmeravanje…</> : "Plati"}
                                        </button>
                                        <button onClick={goToCart} className="w-full py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
                                            Pogledaj celu korpu
                                        </button>
                                    </div>
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default CartDrawer;
