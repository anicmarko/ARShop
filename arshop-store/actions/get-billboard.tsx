import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id: string): Promise<Billboard> => {
    const res = await fetch(`${URL}/${id}`);
    const data = await res.json();
    return data;
}

export const getFirstBillboard = async (): Promise<Billboard | null> => {
    const res = await fetch(URL);
    const data: Billboard[] = await res.json();
    return data?.[0] ?? null;
}

export default getBillboard;