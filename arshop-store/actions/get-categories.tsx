import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch(URL, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

export default getCategories;
