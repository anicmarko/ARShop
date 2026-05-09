"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, ShoppingBag, Tag } from "lucide-react";

import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const cart = useCart();
    const wishlist = useWishlist();

    useEffect(() => setMounted(true), []);

    const totalCartItems = mounted ? cart.totalItems() : 0;
    const wishlistCount = mounted ? wishlist.items.length : 0;

    const tabs = [
        { href: "/", icon: Home, label: "Home" },
        { href: "#categories", icon: Tag, label: "Shop", isCategory: true },
        {
            href: "/wishlist",
            icon: Heart,
            label: "Wishlist",
            badge: wishlistCount,
            activeFill: true,
        },
        {
            href: "/cart",
            icon: ShoppingBag,
            label: "Cart",
            badge: totalCartItems,
        },
    ];

    return (
        <nav
            aria-label="Mobile navigation"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 pb-safe"
        >
            <div className="flex items-center justify-around px-2 py-1">
                {tabs.map(({ href, icon: Icon, label, badge, activeFill }) => {
                    const isActive =
                        href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(href) && href !== "/";
                    const isWishlist = href === "/wishlist";

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-label={label}
                            className={cn(
                                "relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors min-w-[60px]",
                                isActive
                                    ? "text-gray-900 dark:text-zinc-100"
                                    : "text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400"
                            )}
                        >
                            <div className="relative">
                                <Icon
                                    size={22}
                                    className={cn(
                                        "transition-all",
                                        isActive && isWishlist && "fill-rose-500 text-rose-500",
                                        isActive && !isWishlist && "text-gray-900 dark:text-zinc-100"
                                    )}
                                />
                                {mounted && badge !== undefined && badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-0.5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                                        {badge > 99 ? "99+" : badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium leading-none">{label}</span>
                            {isActive && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
