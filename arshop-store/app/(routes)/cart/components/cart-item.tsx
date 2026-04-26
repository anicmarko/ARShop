"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

import Currency from "@/components/ui/currency";
import useCart from "@/hooks/useCart";
import { CartItem } from "@/types";

interface CartItemProps {
    data: CartItem;
}

const CartItemRow: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();
    const { product, quantity } = data;

    return (
        <li className="flex py-6 border-b border-gray-200 dark:border-zinc-800">
            {/* Image */}
            <div className="relative h-24 w-24 rounded-xl overflow-hidden sm:h-40 sm:w-40 bg-gray-100 dark:bg-zinc-800 shrink-0">
                {product?.images?.[0]?.url && (
                    <Image
                        fill
                        alt={product.name}
                        sizes="(max-width: 640px) 96px, 160px"
                        src={product.images[0].url}
                        className="object-cover object-center"
                    />
                )}
            </div>

            {/* Details */}
            <div className="ml-4 sm:ml-6 flex flex-1 flex-col justify-between min-w-0">
                {/* Top row: name + remove */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-base font-semibold text-gray-900 dark:text-zinc-100 truncate">
                            {product.name}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-zinc-400">
                            {product.color?.name && (
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="h-3 w-3 rounded-full border border-gray-300 dark:border-zinc-600 shrink-0"
                                        style={{ backgroundColor: product.color.value }}
                                        aria-hidden="true"
                                    />
                                    {product.color.name}
                                </span>
                            )}
                            {product.size?.name && (
                                <span className="border-l border-gray-200 dark:border-zinc-700 pl-3">
                                    {product.size.name}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => cart.removeItem(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                        className="p-1.5 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Bottom row: qty stepper + line price */}
                <div className="mt-4 flex items-center justify-between gap-4">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1 rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-0.5">
                        <button
                            onClick={() => cart.updateQuantity(product.id, quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-40"
                            disabled={quantity <= 1}
                        >
                            <Minus size={13} />
                        </button>
                        <span
                            className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-zinc-100 tabular-nums"
                            aria-label={`Quantity: ${quantity}`}
                        >
                            {quantity}
                        </span>
                        <button
                            onClick={() => cart.updateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <Plus size={13} />
                        </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                        <Currency value={Number(product.price) * quantity} />
                        {quantity > 1 && (
                            <div className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 flex items-center justify-end gap-1">
                                <Currency value={product.price} /><span>each</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItemRow;
