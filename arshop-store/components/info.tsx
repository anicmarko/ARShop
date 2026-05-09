"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Share2, ShoppingCart } from "lucide-react";
import { useUser } from "@clerk/nextjs";

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
    const router = useRouter();
    const { isSignedIn } = useUser();
    const cart = useCart();
    const wishlist = useWishlist();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

    useEffect(() => setMounted(true), []);

    const isWishlisted = mounted && wishlist.hasItem(data.id);
    const selectedSize = data.sizes.find((s) => s.sizeId === selectedSizeId);
    const isInCart = mounted && cart.items.some(
        (i) => i.product.id === data.id && i.sizeId === selectedSizeId
    );

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const handleAddToCart = () => {
        if (!selectedSizeId || !selectedSize) return;
        cart.addItem(data, selectedSizeId, selectedSize.size.name);
    };

    const addToCartDisabled = !selectedSizeId || isInCart || (selectedSize?.stock === 0);

    const addToCartLabel = !selectedSizeId
        ? "Select a size"
        : isInCart
        ? "Added to cart"
        : selectedSize?.stock === 0
        ? "Out of stock"
        : "Add to cart";

    return (
        <>
            <div>
                {/* Title row */}
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
                                onClick={() => {
                                    if (!isSignedIn) { router.push("/sign-in"); return; }
                                    wishlist.toggle(data);
                                }}
                                aria-label={isWishlisted ? `Remove ${data.name} from wishlist` : `Save ${data.name} to wishlist`}
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
                    {/* Color */}
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

                    {/* Size selector */}
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                            Size {selectedSize && <span className="text-gray-900 dark:text-zinc-100 normal-case font-medium">— {selectedSize.size.name}</span>}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.sizes.map((ps) => {
                                const outOfStock = ps.stock === 0;
                                const isSelected = ps.sizeId === selectedSizeId;
                                return (
                                    <button
                                        key={ps.sizeId}
                                        onClick={() => !outOfStock && setSelectedSizeId(ps.sizeId)}
                                        disabled={outOfStock}
                                        title={outOfStock ? "Out of stock" : `${ps.stock} in stock`}
                                        className={cn(
                                            "min-w-[3rem] px-3 py-1.5 rounded-md border text-sm font-medium transition-colors",
                                            isSelected
                                                ? "border-gray-900 dark:border-zinc-100 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                                : outOfStock
                                                ? "border-gray-200 dark:border-zinc-700 text-gray-300 dark:text-zinc-600 cursor-not-allowed line-through"
                                                : "border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:border-gray-900 dark:hover:border-zinc-100"
                                        )}
                                    >
                                        {ps.size.name}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedSize && (
                            <p className="mt-1.5 text-xs text-gray-400 dark:text-zinc-500">
                                {selectedSize.stock} kom na stanju
                            </p>
                        )}
                    </div>
                </div>

                {/* Desktop add to cart */}
                <div className="mt-8 hidden lg:block">
                    <Button
                        className="flex items-center gap-x-2"
                        onClick={handleAddToCart}
                        disabled={addToCartDisabled}
                        aria-label={addToCartLabel}
                    >
                        {addToCartLabel}
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
                        onClick={handleAddToCart}
                        disabled={addToCartDisabled}
                        className="shrink-0"
                        aria-label={addToCartLabel}
                    >
                        {addToCartLabel}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Info;
