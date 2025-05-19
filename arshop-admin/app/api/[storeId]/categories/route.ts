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

        const { name, billboardId } = body;

        if(!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401});
        }

        if(!name) {
            return NextResponse.json({ error: "Name is required", status: 400});
        }

        if(!billboardId) {
            return NextResponse.json({ error: "Billboard ID is required", status: 400});
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

        const category  = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId
            }
        });
    
        return NextResponse.json(category);

    } catch (error) {
        console.error('[CATEGORIES_POST]', error);
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

        const categories  = await prismadb.category.findMany({
            where: {
                storeId
            }
        });
    
        return NextResponse.json(categories);

    } catch (error) {
        console.error('[CATEGORIES_GET]', error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}
