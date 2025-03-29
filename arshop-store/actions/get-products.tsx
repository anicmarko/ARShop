import { Product } from "@/types";
import qs  from "query-string"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface QueryParams {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    isFeatured?: boolean;
}

const getProducts = async (query: QueryParams): Promise<Product[]> => {
    const url = qs.stringifyUrl({
        url: URL,
        query: {
            ...query,
        },
    })
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export default getProducts;