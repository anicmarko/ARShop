import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getFirstBillboard } from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import ProductList from "@/components/product-list";

export const revalidate = 0;

const HomePage = async () => {
    const [billboard, products, categories] = await Promise.all([
        getFirstBillboard(),
        getProducts({ isFeatured: true }),
        getCategories(),
    ]);

    const shopHref = categories[0] ? `/category/${categories[0].id}` : "#featured";

    return (
        <div className="bg-white dark:bg-zinc-950">
            {/* ── Full-viewport hero ── */}
            <section className="relative h-[calc(100vh-64px)] min-h-[480px] overflow-hidden bg-zinc-900">
                {billboard?.imageUrl && (
                    <Image
                        fill
                        src={billboard.imageUrl}
                        alt=""
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end">
                    <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-12 lg:px-20 pb-16 sm:pb-28">
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400 mb-5">
                            New Collection
                        </p>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-8 max-w-2xl">
                            {billboard?.label ?? "Discover Our Collection"}
                        </h1>
                        <Link
                            href={shopHref}
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
                        >
                            Shop Now
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Categories showcase ── */}
            {categories.length > 0 && (
                <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-screen-xl mx-auto">
                    <div className="mb-8">
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-600 mb-2">
                            Explore
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                            Shop by Category
                        </h2>
                    </div>
                    <div className={`grid gap-4 ${
                        categories.length === 1
                            ? "grid-cols-1 max-w-sm"
                            : categories.length === 2
                            ? "grid-cols-2"
                            : categories.length === 3
                            ? "grid-cols-2 sm:grid-cols-3"
                            : "grid-cols-2 sm:grid-cols-4"
                    }`}>
                        {categories.map((category, i) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.id}`}
                                className={`group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900 to-zinc-900 ${
                                    i === 0 && categories.length >= 3
                                        ? "sm:row-span-2 min-h-[280px]"
                                        : "min-h-[160px] sm:min-h-[200px]"
                                }`}
                            >
                                {category.billboard?.imageUrl ? (
                                    <Image
                                        fill
                                        src={category.billboard.imageUrl}
                                        alt={category.name}
                                        sizes="(max-width: 640px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute inset-0 flex items-end p-5">
                                    <div>
                                        <p className="text-white font-bold text-lg leading-tight">
                                            {category.name}
                                        </p>
                                        <p className="text-white/70 text-xs mt-1 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                                            Shop now
                                            <ArrowRight size={11} />
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Featured products ── */}
            <section id="featured" className="py-16 px-4 sm:px-8 lg:px-16 max-w-screen-xl mx-auto">
                <ProductList title="Featured Products" items={products} />
            </section>
        </div>
    );
};

export default HomePage;
