"use client";

import { useEffect, useState } from "react";
import { Check, Heart, Share2, ShoppingCart } from "lucide-react";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const cart = useCart();
    const wishlist = useWishlist();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => setMounted(true), []);

    const isWishlisted = mounted && wishlist.hasItem(data.id);
    const isInCart = mounted && cart.items.some((item) => item.product.id === data.id);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard not available in older browsers
        }
    };

    return (
        <>
            <div>
                {/* Title row with share + wishlist */}
                <div className="flex items-start justify-between gap-3">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">
                        {data?.name}
                    </h1>
                    {mounted && (
                        <div className="flex items-center gap-2 shrink-0 mt-1">
                            <button
                                onClick={handleShare}
                                aria-label="Share this product"
                                className="p-2.5 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
                            >
                                {copied
                                    ? <Check size={17} className="text-emerald-500" />
                                    : <Share2 size={17} />
                                }
                            </button>
                            <button
                                onClick={() => wishlist.toggle(data)}
                                aria-label={
                                    isWishlisted
                                        ? `Remove ${data.name} from wishlist`
                                        : `Save ${data.name} to wishlist`
                                }
                                className={cn(
                                    "p-2.5 rounded-full border transition-colors",
                                    isWishlisted
                                        ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                                        : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-800"
                                )}
                            >
                                <Heart size={17} className={cn(isWishlisted && "fill-rose-500")} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-3">
                    <Currency value={data?.price} />
                </div>

                <hr className="my-6 border-gray-200 dark:border-zinc-800" />

                <div className="flex flex-col gap-y-5">
                    <div className="flex items-center gap-x-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 w-12">
                            Size
                        </span>
                        <span className="text-gray-900 dark:text-zinc-100 font-medium">
                            {data?.size?.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 w-12">
                            Color
                        </span>
                        <div className="flex items-center gap-x-2" aria-label={`Color: ${data?.color?.name}`}>
                            <span
                                className="h-5 w-5 rounded-full border border-gray-300 dark:border-zinc-600"
                                style={{ backgroundColor: data?.color?.value }}
                                title={data?.color?.name}
                            />
                            <span className="text-gray-900 dark:text-zinc-100 font-medium">
                                {data?.color?.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop add to cart */}
                <div className="mt-8 hidden lg:block">
                    <Button
                        className="flex items-center gap-x-2"
                        onClick={() => cart.addItem(data)}
                        disabled={isInCart}
                        aria-label={isInCart ? "Already in cart" : `Add ${data.name} to cart`}
                    >
                        {isInCart ? "Added to cart" : "Add to cart"}
                        <ShoppingCart size={16} aria-hidden="true" />
                    </Button>
                </div>
            </div>

            {/* Sticky mobile add-to-cart bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 px-4 pt-3 pb-4 pb-safe">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate leading-tight">
                            {data.name}
                        </p>
                        <Currency value={data?.price} />
                    </div>
                    <Button
                        onClick={() => cart.addItem(data)}
                        disabled={isInCart}
                        className="shrink-0"
                        aria-label={isInCart ? "Already in cart" : `Add ${data.name} to cart`}
                    >
                        {isInCart ? "In cart" : "Add to cart"}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Info;
