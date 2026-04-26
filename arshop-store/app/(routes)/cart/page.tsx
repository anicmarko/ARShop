"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, XCircle } from "lucide-react";

import Container from "@/components/ui/container";
import useCart from "@/hooks/useCart";
import Button from "@/components/ui/button";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";

const CartPageInner = () => {
    const cart = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    const clearCart = useCart((state) => state.clearCart);

    useEffect(() => setMounted(true), []);

    const isSuccess = searchParams.has("success");
    const isCanceled = searchParams.has("canceled");

    useEffect(() => {
        if (isSuccess) clearCart();
    }, [isSuccess, clearCart]);

    if (!mounted) {
        return (
            <div className="bg-white dark:bg-zinc-950 min-h-screen">
                <Container>
                    <div className="px-4 py-16 sm:px-6 lg:px-8">
                        <div className="h-9 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-12" />
                        <div className="space-y-6">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="h-32 rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    /* ── Order success screen ─────────────────────────────────────── */
    if (isSuccess) {
        return (
            <div className="bg-white dark:bg-zinc-950 min-h-screen">
                <Container>
                    <div className="px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-6 min-h-[60vh]">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                            <CheckCircle size={40} className="text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-2">
                                Order Confirmed!
                            </h1>
                            <p className="text-gray-500 dark:text-zinc-400 max-w-md">
                                Thank you for your purchase. Your order has been placed and is being processed.
                            </p>
                        </div>
                        <Button onClick={() => router.push("/")}>
                            Continue Shopping
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    /* ── Checkout canceled screen ─────────────────────────────────── */
    if (isCanceled) {
        return (
            <div className="bg-white dark:bg-zinc-950 min-h-screen">
                <Container>
                    <div className="px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-6 min-h-[60vh]">
                        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                            <XCircle size={40} className="text-rose-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-2">
                                Payment Canceled
                            </h1>
                            <p className="text-gray-500 dark:text-zinc-400 max-w-md">
                                Your order was not completed. Your cart is still saved — you can try again whenever you&apos;re ready.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => router.push("/cart")}>
                                Back to Cart
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    /* ── Main cart view ───────────────────────────────────────────── */
    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">
            <Container>
                <div className="px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                        Shopping Cart
                    </h1>

                    {cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-5">
                            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                <ShoppingBag size={36} className="text-gray-400 dark:text-zinc-500" aria-hidden="true" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                                    Your cart is empty
                                </p>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">
                                    Add some items to get started.
                                </p>
                            </div>
                            <Button onClick={() => router.push("/")}>
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                            <div className="lg:col-span-7">
                                <ul aria-label="Cart items">
                                    {cart.items.map((item) => (
                                        <CartItem key={item.product.id} data={item} />
                                    ))}
                                </ul>
                            </div>
                            <Suspense fallback={
                                <div className="h-48 rounded-2xl bg-gray-100 dark:bg-zinc-800 animate-pulse lg:col-span-5 mt-16 lg:mt-0" />
                            }>
                                <Summary />
                            </Suspense>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

const CartPage = () => (
    <Suspense fallback={
        <div className="bg-white dark:bg-zinc-950 min-h-screen">
            <Container>
                <div className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="h-9 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
            </Container>
        </div>
    }>
        <CartPageInner />
    </Suspense>
);

export default CartPage;
