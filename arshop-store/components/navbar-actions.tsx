"use client";

import { Heart, ShoppingBag, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/use-wishlist";
import { useTheme } from "@/providers/theme-provider";

const NavbarActions = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cart = useCart();
    const wishlist = useWishlist();
    const router = useRouter();
    const { theme, toggle } = useTheme();
    const { isSignedIn } = useAuth();

    if (!mounted) {
        return <div className="ml-auto flex items-center gap-x-4 h-9" />;
    }

    return (
        <div className="ml-auto flex items-center gap-x-2">
            <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="p-2 rounded-full text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
                onClick={() => router.push("/wishlist")}
                aria-label={`Wishlist (${wishlist.items.length} stavki)`}
                className="relative p-2 rounded-full text-gray-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Heart size={18} />
                {wishlist.items.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {wishlist.items.length > 9 ? "9+" : wishlist.items.length}
                    </span>
                )}
            </button>

            <button
                onClick={() => router.push("/cart")}
                aria-label={`Korpa (${cart.totalItems()} stavki)`}
                className="flex items-center gap-x-2 rounded-full bg-gray-900 dark:bg-zinc-100 px-4 py-2 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
                <ShoppingBag size={16} />
                <span aria-hidden="true">{cart.totalItems()}</span>
            </button>

            {isSignedIn ? (
                <UserButton />
            ) : (
                <SignInButton mode="modal">
                    <button className="text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors px-2">
                        Prijavi se
                    </button>
                </SignInButton>
            )}
        </div>
    );
};

export default NavbarActions;
