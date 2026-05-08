"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, MouseEventHandler } from "react";
import Image from "next/image";
import { Expand, Heart, ShoppingCart } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const router = useRouter();
    const { isSignedIn } = useUser();
    const previewModal = usePreviewModal();
    const cart = useCart();
    const wishlist = useWishlist();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isWishlisted = mounted && wishlist.hasItem(data.id);
    const cartItem = mounted ? cart.items.find((i) => i.product.id === data.id) : undefined;
    const cartQty = cartItem?.quantity ?? 0;

    const handleClick = () => router.push(`/product/${data?.id}`);

    const onPreview: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        previewModal.onOpen(data);
    };

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        router.push(`/product/${data.id}`);
    };

    const onToggleWishlist: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        if (!isSignedIn) {
            router.push("/sign-in");
            return;
        }
        wishlist.toggle(data);
    };

    return (
        <div onClick={handleClick} className="group cursor-pointer">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
                {data?.images?.[0]?.url && (
                    <Image
                        fill
                        alt={data.name}
                        src={data.images[0].url}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                )}

                {/* Featured badge — bottom left */}
                {data.isFeatured && (
                    <span className="absolute bottom-12 left-3 z-10 px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider">
                        Featured
                    </span>
                )}

                {/* Wishlist button — top left */}
                {mounted && (
                    <button
                        onClick={onToggleWishlist}
                        aria-label={isWishlisted ? `Remove ${data.name} from wishlist` : `Save ${data.name} to wishlist`}
                        className={cn(
                            "absolute top-3 left-3 p-2 rounded-full bg-white/85 dark:bg-zinc-800/85 backdrop-blur-sm shadow-sm transition-all duration-200",
                            isWishlisted
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0"
                        )}
                    >
                        <Heart
                            size={13}
                            className={cn(
                                "transition-colors",
                                isWishlisted
                                    ? "fill-rose-500 text-rose-500"
                                    : "text-gray-700 dark:text-zinc-200"
                            )}
                        />
                    </button>
                )}

                {/* In-cart quantity badge — top right (hidden on hover to reveal preview) */}
                {cartQty > 0 && (
                    <span className="absolute top-3 right-3 z-10 h-5 min-w-[20px] px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
                        {cartQty}
                    </span>
                )}

                {/* Preview button — top right */}
                <button
                    onClick={onPreview}
                    aria-label={`Quick preview ${data.name}`}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/85 dark:bg-zinc-800/85 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                >
                    <Expand size={13} className="text-gray-700 dark:text-zinc-200" />
                </button>

                {/* Add to cart — slides up from bottom */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <button
                        onClick={onAddToCart}
                        aria-label={`Add ${data.name} to cart`}
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
                        {data.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 truncate">
                        {data.category?.name}
                    </p>
                </div>
                <div className="shrink-0 text-right">
                    <Currency value={data?.price} />
                    {data.color?.value && (
                        <div className="mt-1.5 flex justify-end" aria-label={`Color: ${data.color.name}`}>
                            <span
                                className="h-3 w-3 rounded-full border border-gray-300 dark:border-zinc-600"
                                style={{ backgroundColor: data.color.value }}
                                title={data.color.name}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
