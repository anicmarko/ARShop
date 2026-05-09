import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import FilterBar from "./components/filter";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
}

interface CategoryPageProps {
    params: Promise<{ categoryId: string }>;
    searchParams: Promise<{
        colorId?: string;
        sizeId?: string;
        sortBy?: string;
        name?: string;
        page?: string;
    }>;
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params, searchParams }) => {
    const { categoryId } = await params;
    const { colorId, sizeId, sortBy, name, page } = await searchParams;

    const currentPage = Math.max(1, parseInt(page ?? "1", 10));
    const skip = (currentPage - 1) * PAGE_SIZE;

    const [{ data: products, total }, sizes, colors, category] = await Promise.all([
        getProducts({ categoryId, colorId, sizeId, name, sortBy, take: PAGE_SIZE, skip }),
        getSizes(),
        getColors(),
        getCategory(categoryId),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    if (!category) return <div className="flex-1 p-8 text-center text-muted-foreground">Category not found.</div>;

    const buildPageUrl = (p: number) => {
        const q = new URLSearchParams({
            ...(colorId ? { colorId } : {}),
            ...(sizeId  ? { sizeId  } : {}),
            ...(sortBy && sortBy !== "newest" ? { sortBy } : {}),
            ...(name    ? { name    } : {}),
            page: String(p),
        });
        return `?${q.toString()}`;
    };

    const pageNumbers = getPageNumbers(safePage, totalPages);

    return (
        <div className="bg-white dark:bg-zinc-950">
            {/* Category header */}
            <div className="relative h-48 sm:h-64 overflow-hidden bg-zinc-900">
                {category.billboard?.imageUrl && (
                    <Image
                        fill
                        src={category.billboard.imageUrl}
                        alt=""
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-12 lg:px-20">
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400 mb-2">
                            Category
                        </p>
                        <h1 className="text-3xl sm:text-5xl font-bold text-white">
                            {category.name}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 pb-24">
                <FilterBar
                    sizes={sizes}
                    colors={colors}
                    productCount={total}
                />
                {products.length === 0 ? (
                    <NoResults />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {products.map((product) => (
                            <ProductCard data={product} key={product.id} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">
                        {/* Previous */}
                        {safePage > 1 ? (
                            <a
                                href={buildPageUrl(safePage - 1)}
                                aria-label="Previous page"
                                className="flex items-center gap-1 px-3 py-2 rounded-full border border-gray-300 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </a>
                        ) : (
                            <span className="flex items-center px-3 py-2 rounded-full border border-gray-200 dark:border-zinc-800 text-gray-300 dark:text-zinc-600 cursor-not-allowed">
                                <ChevronLeft size={14} />
                            </span>
                        )}

                        {/* Numbered pages */}
                        {pageNumbers.map((p, i) =>
                            p === "..." ? (
                                <span
                                    key={`ellipsis-${i}`}
                                    className="px-2 py-2 text-sm text-gray-400 dark:text-zinc-500 select-none"
                                >
                                    …
                                </span>
                            ) : (
                                <a
                                    key={p}
                                    href={buildPageUrl(p)}
                                    aria-label={`Page ${p}`}
                                    aria-current={p === safePage ? "page" : undefined}
                                    className={
                                        p === safePage
                                            ? "w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                            : "w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                    }
                                >
                                    {p}
                                </a>
                            )
                        )}

                        {/* Next */}
                        {safePage < totalPages ? (
                            <a
                                href={buildPageUrl(safePage + 1)}
                                aria-label="Next page"
                                className="flex items-center gap-1 px-3 py-2 rounded-full border border-gray-300 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <ChevronRight size={14} />
                            </a>
                        ) : (
                            <span className="flex items-center px-3 py-2 rounded-full border border-gray-200 dark:border-zinc-800 text-gray-300 dark:text-zinc-600 cursor-not-allowed">
                                <ChevronRight size={14} />
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
