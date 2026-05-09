import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface QueryParams {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    isFeatured?: boolean;
    name?: string;
    sortBy?: string;
    take?: number;
    skip?: number;
}

const getProducts = async (query: QueryParams): Promise<{ data: Product[]; total: number }> => {
    const url = qs.stringifyUrl({ url: URL, query: { ...query } });
    try {
        const res = await fetch(url, {
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return { data: [], total: 0 };
        const json = await res.json();
        if (Array.isArray(json)) return { data: json, total: json.length };
        return { data: Array.isArray(json.data) ? json.data : [], total: json.total ?? 0 };
    } catch {
        return { data: [], total: 0 };
    }
};

export default getProducts;
