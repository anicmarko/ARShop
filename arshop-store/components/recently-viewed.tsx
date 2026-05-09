"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock } from "lucide-react";

import { Product } from "@/types";
import useRecentlyViewed from "@/hooks/use-recently-viewed";
import Currency from "@/components/ui/currency";

interface RecentlyViewedProps {
    currentProductId: string;
    product: Product;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId, product }) => {
    const [mounted, setMounted] = useState(false);
    const { addItem, items } = useRecentlyViewed();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        addItem(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProductId]);

    if (!mounted) return null;

    const visible = items.filter((p) => p.id !== currentProductId).slice(0, 6);
    if (visible.length === 0) return null;

    return (
        <div className="mt-16">
            <hr className="mb-12 border-gray-200 dark:border-zinc-800" />
            <div className="mb-8 flex items-center gap-2">
                <Clock size={15} className="text-gray-400 dark:text-zinc-500" aria-hidden="true" />
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-zinc-500">
                    Recently Viewed
                </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {visible.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => router.push(`/product/${item.id}`)}
                        className="group cursor-pointer"
                    >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
                            {item?.images?.[0]?.url && (
                                <Image
                                    fill
                                    src={item.images[0].url}
                                    alt={item.name}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                        </div>
                        <div className="mt-2 px-0.5">
                            <p className="text-xs font-medium text-gray-800 dark:text-zinc-200 truncate">
                                {item.name}
                            </p>
                            <Currency value={item.price} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
