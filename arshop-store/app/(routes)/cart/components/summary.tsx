"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Truck } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/useCart";

const FREE_SHIPPING_THRESHOLD = 5000; // RSD

const Summary = () => {
    const items = useCart((state) => state.items);
    const [loading, setLoading] = useState(false);

    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

    const onCheckout = async () => {
        try {
            setLoading(true);
            // Repeat each productId by its quantity
            const productIds = items.flatMap(({ product, quantity }) =>
                Array<string>(quantity).fill(product.id)
            );
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productIds,
            });
            window.location.href = res.data.url;
        } catch {
            toast.error("Could not start checkout. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16 lg:mt-0 lg:col-span-5 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-4 py-6 sm:p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                Order summary
            </h2>

            {/* Free shipping progress */}
            <div className="mt-5 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2.5">
                    <Truck
                        size={15}
                        className={freeShipping ? "text-emerald-500" : "text-gray-400 dark:text-zinc-500"}
                        aria-hidden="true"
                    />
                    {freeShipping ? (
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            🎉 Besplatna dostava je otključana!
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                            Dodaj još{" "}
                            <span className="font-semibold text-gray-900 dark:text-zinc-100">
                                {remaining.toLocaleString("sr-RS")} RSD
                            </span>{" "}
                            za besplatnu dostavu
                        </p>
                    )}
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
            </div>

            {/* Line items */}
            <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400">
                    <p>Proizvodi ({totalQty} {totalQty === 1 ? "kom" : "kom"})</p>
                    <Currency value={subtotal} />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400">
                    <p>Dostava</p>
                    <p className={freeShipping ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                        {freeShipping ? "Besplatno" : "Obračunava se pri plaćanju"}
                    </p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-zinc-700 pt-4">
                    <p className="text-base font-semibold text-gray-900 dark:text-zinc-100">
                        Ukupno
                    </p>
                    <Currency value={subtotal} />
                </div>
            </div>

            <Button
                className="w-full mt-6 flex items-center justify-center gap-2"
                onClick={onCheckout}
                disabled={items.length === 0 || loading}
                aria-label="Nastavi na plaćanje"
            >
                {loading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Preusmeravanje…
                    </>
                ) : (
                    "Plati"
                )}
            </Button>

            <p className="mt-3 text-center text-xs text-gray-400 dark:text-zinc-500">
                Sigurno plaćanje putem Stripe-a
            </p>
        </div>
    );
};

export default Summary;
