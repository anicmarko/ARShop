import Image from "next/image";
import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import FilterBar from "./components/filter";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";

export const revalidate = 0;

type SortKey = "newest" | "price-asc" | "price-desc";

function sortProducts(products: Product[], sortBy: SortKey): Product[] {
    if (sortBy === "price-asc") {
        return [...products].sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === "price-desc") {
        return [...products].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return products; // "newest" — API already returns DESC by createdAt
}

interface CategoryPageProps {
    params: Promise<{ categoryId: string }>;
    searchParams: Promise<{ colorId?: string; sizeId?: string; sortBy?: string }>;
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params, searchParams }) => {
    const { categoryId } = await params;
    const { colorId, sizeId, sortBy } = await searchParams;

    const [rawProducts, sizes, colors, category] = await Promise.all([
        getProducts({ categoryId, colorId, sizeId }),
        getSizes(),
        getColors(),
        getCategory(categoryId),
    ]);

    const products = sortProducts(rawProducts, (sortBy as SortKey) ?? "newest");

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
                    productCount={products.length}
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
            </div>
        </div>
    );
};

export default CategoryPage;
