import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id: string): Promise<Category | null> => {
    try {
        const res = await fetch(`${URL}/${id}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
};

export default getCategory;
