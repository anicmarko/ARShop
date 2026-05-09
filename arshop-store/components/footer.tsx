import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <p className="font-bold text-xl tracking-tight text-gray-900 dark:text-zinc-100">
                                AR<span className="text-violet-600">Shop</span>
                            </p>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed max-w-[200px]">
                            Premium fashion for every occasion.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="p-2 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter / X"
                                className="p-2 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Twitter size={16} />
                            </a>
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="p-2 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Facebook size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-zinc-100 mb-4">
                            Shop
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "All Products", href: "/" },
                                { label: "New Arrivals", href: "/" },
                                { label: "Featured", href: "/" },
                                { label: "Wishlist", href: "/wishlist" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-zinc-100 mb-4">
                            Help
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "FAQ",
                                "Shipping & Returns",
                                "Size Guide",
                                "Contact Us",
                            ].map((item) => (
                                <li key={item}>
                                    <span className="text-sm text-gray-500 dark:text-zinc-400 cursor-default">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-zinc-100 mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Privacy Policy",
                                "Terms of Service",
                                "Cookie Policy",
                            ].map((item) => (
                                <li key={item}>
                                    <span className="text-sm text-gray-500 dark:text-zinc-400 cursor-default">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400 dark:text-zinc-500">
                        &copy; {new Date().getFullYear()} ARShop, Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                            alt="Stripe"
                            className="h-5 opacity-40 dark:invert dark:opacity-30"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
