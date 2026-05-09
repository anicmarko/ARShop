"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import useWishlist from "@/hooks/use-wishlist";
import useCart from "@/hooks/useCart";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import Container from "@/components/ui/container";

const WishlistPage = () => {
    const [mounted, setMounted] = useState(false);
    const wishlist = useWishlist();
    const cart = useCart();
    const router = useRouter();

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="bg-white dark:bg-zinc-950 min-h-screen">
                <Container>
                    <div className="px-4 py-16 sm:px-6 lg:px-8">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-12" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    const items = wishlist.items;

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">
            <Container>
                <div className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart size={22} className="text-rose-500 fill-rose-500" aria-hidden="true" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                            Wishlist
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mb-10">
                        {items.length === 0
                            ? "No saved items yet"
                            : `${items.length} saved item${items.length !== 1 ? "s" : ""}`}
                    </p>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-5">
                            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                                <Heart size={36} className="text-rose-300 dark:text-rose-700" aria-hidden="true" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                                    Your wishlist is empty
                                </p>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">
                                    Save items you love and come back to them anytime.
                                </p>
                            </div>
                            <Button onClick={() => router.push("/")}>
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="group relative flex flex-col">
                                    {/* Image */}
                                    <div
                                        className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800 cursor-pointer"
                                        onClick={() => router.push(`/product/${item.id}`)}
                                    >
                                        {item?.images?.[0]?.url && (
                                            <Image
                                                fill
                                                alt={item.name}
                                                src={item.images[0].url}
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                            />
                                        )}

                                        {/* Remove from wishlist */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                wishlist.removeItem(item.id);
                                            }}
                                            aria-label={`Remove ${item.name} from wishlist`}
                                            className="absolute top-3 right-3 p-2 rounded-full bg-white/85 dark:bg-zinc-800/85 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        >
                                            <Trash2 size={13} className="text-rose-500" />
                                        </button>

                                        {/* Add to cart overlay */}
                                        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/product/${item.id}`);
                                                }}
                                                aria-label={`Add ${item.name} to cart`}
                                                className="w-full flex items-center justify-center gap-2 bg-white/95 dark:bg-zinc-100 text-gray-900 dark:text-zinc-900 py-3 text-xs font-semibold backdrop-blur-sm"
                                            >
                                                <ShoppingCart size={13} />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="mt-3 px-0.5 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-gray-900 dark:text-zinc-100 truncate leading-snug">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 truncate">
                                                {item.category?.name}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <Currency value={item?.price} />
                                            {item.color?.value && (
                                                <div
                                                    className="mt-1.5 flex justify-end"
                                                    aria-label={`Color: ${item.color.name}`}
                                                >
                                                    <span
                                                        className="h-3 w-3 rounded-full border border-gray-300 dark:border-zinc-600"
                                                        style={{ backgroundColor: item.color.value }}
                                                        title={item.color.name}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default WishlistPage;
