import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }

) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if(!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401});
        }

        if(!label) {
            return NextResponse.json({ error: "Label is required", status: 400});
        }

        if(!imageUrl) {
            return NextResponse.json({ error: "Image URL is required", status: 400});
        }

        const { storeId }= await params;

        if(!storeId) {
            return NextResponse.json({ error: "Store ID is required", status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return NextResponse.json({ error: "Unauthorized", status: 403});
        }

        const billboard  = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId
            }
        });
    
        return NextResponse.json(billboard);

    } catch (error) {
        console.error('[BILLBOARDS_POST]', error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}
export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }

) {
    try {

        const { storeId }= await params;

        if(!storeId) {
            return NextResponse.json({ error: "Store ID is required", status: 400});
        }

        const billboards  = await prismadb.billboard.findMany({
            where: {
                storeId
            }
        });
    
        return NextResponse.json(billboards);

    } catch (error) {
        console.error('[BILLBOARDS_GET]', error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}
