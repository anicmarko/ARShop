import { Size } from "@/types";
import qs from "query-string";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = async (categoryId?: string): Promise<Size[]> => {
    const url = qs.stringifyUrl({ url: BASE_URL, query: { categoryId } }, { skipNull: true });
    try {
        const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

export default getSizes;
