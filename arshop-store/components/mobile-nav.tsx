"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Home, Heart, Menu, ShoppingBag, Tag, X } from "lucide-react";

import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface MobileNavProps {
    categories: Category[];
}

const MobileNav: React.FC<MobileNavProps> = ({ categories }) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const close = () => setOpen(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2 rounded-full text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Menu size={20} />
            </button>

            <Dialog open={open} as="div" className="relative z-50 lg:hidden" onClose={close}>
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

                <div className="fixed inset-0 z-50 flex">
                    <DialogPanel className="relative flex h-full w-full max-w-[280px] flex-col bg-white dark:bg-zinc-950 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                            <Link
                                href="/"
                                onClick={close}
                                className="font-bold text-xl tracking-tight text-gray-900 dark:text-zinc-100"
                            >
                                AR<span className="text-violet-600">Shop</span>
                            </Link>
                            <button
                                onClick={close}
                                aria-label="Close menu"
                                className="p-2 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable content */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                            <Link
                                href="/"
                                onClick={close}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                    pathname === "/"
                                        ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                                        : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/70 hover:text-gray-900 dark:hover:text-zinc-100"
                                )}
                            >
                                <Home size={16} aria-hidden="true" />
                                Home
                            </Link>

                            {categories.length > 0 && (
                                <div className="pt-4">
                                    <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-600">
                                        Categories
                                    </p>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/category/${cat.id}`}
                                            onClick={close}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                                pathname === `/category/${cat.id}`
                                                    ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                                                    : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/70 hover:text-gray-900 dark:hover:text-zinc-100"
                                            )}
                                        >
                                            <Tag size={15} aria-hidden="true" />
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </nav>

                        {/* Footer links */}
                        <div className="shrink-0 px-3 py-4 border-t border-gray-100 dark:border-zinc-800 space-y-0.5">
                            <Link
                                href="/wishlist"
                                onClick={close}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/70 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <Heart size={16} aria-hidden="true" />
                                Wishlist
                            </Link>
                            <Link
                                href="/cart"
                                onClick={close}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/70 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <ShoppingBag size={16} aria-hidden="true" />
                                Cart
                            </Link>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default MobileNav;
