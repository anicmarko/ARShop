import Link from "next/link";
import { ChevronRight } from "lucide-react";

import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import RecentlyViewed from "@/components/recently-viewed";

interface ProductPageProps {
    params: Promise<{ productId: string }>;
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
    const { productId } = await params;

    const product = await getProduct(productId);
    const suggestedProducts = await getProducts({ categoryId: product?.category?.id });

    const related = suggestedProducts.filter((p) => p.id !== productId);

    return (
        <div className="bg-white dark:bg-zinc-950">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-6 lg:py-12 pb-28 lg:pb-12">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 mb-8">
                    <Link href="/" className="hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">
                        Home
                    </Link>
                    <ChevronRight size={12} aria-hidden="true" />
                    {product?.category && (
                        <>
                            <Link
                                href={`/category/${product.category.id}`}
                                className="hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                {product.category.name}
                            </Link>
                            <ChevronRight size={12} aria-hidden="true" />
                        </>
                    )}
                    <span className="text-gray-600 dark:text-zinc-300 truncate max-w-[160px]">
                        {product?.name}
                    </span>
                </nav>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    <Gallery images={product.images} />
                    <div className="mt-8 lg:mt-0">
                        <Info data={product} />
                    </div>
                </div>

                {related.length > 0 && (
                    <>
                        <hr className="my-12 border-gray-200 dark:border-zinc-800" />
                        <ProductList title="You may also like" items={related} />
                    </>
                )}

                <RecentlyViewed currentProductId={productId} product={product} />
            </div>
        </div>
    );
};

export default ProductPage;
