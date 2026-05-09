import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

interface ProductListProps {
    title: string;
    items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
    const safeItems = Array.isArray(items) ? items : [];
    return (
        <div>
            <div className="mb-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-600 mb-2">
                    Collection
                </p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                    {title}
                </h2>
            </div>
            {safeItems.length === 0 ? (
                <NoResults />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {safeItems.map((item) => (
                        <ProductCard key={item.id} data={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
