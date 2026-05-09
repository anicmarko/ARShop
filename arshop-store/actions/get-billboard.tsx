import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id: string): Promise<Billboard | null> => {
    try {
        const res = await fetch(`${URL}/${id}`, {
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
};

export const getFirstBillboard = async (): Promise<Billboard | null> => {
    try {
        const res = await fetch(URL, {
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return Array.isArray(data) ? (data[0] ?? null) : null;
    } catch {
        return null;
    }
};

export default getBillboard;
