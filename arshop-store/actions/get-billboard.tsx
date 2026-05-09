import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id: string): Promise<Billboard> => {
    const res = await fetch(`${URL}/${id}`);
    const data = await res.json();
    return data;
}

export const getFirstBillboard = async (): Promise<Billboard | null> => {
    try {
        const res = await fetch(URL);
        const data = await res.json();
        return Array.isArray(data) ? (data[0] ?? null) : null;
    } catch {
        return null;
    }
};

export default getBillboard;