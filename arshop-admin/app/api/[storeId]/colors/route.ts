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

        const { name, value } = body;

        if(!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401});
        }

        if(!name) {
            return NextResponse.json({ error: "Name is required", status: 400});
        }

        if(!value) {
            return NextResponse.json({ error: "Value is required", status: 400});
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

        const color  = await prismadb.color.create({
            data: {
                name,
                value,
                storeId
            }
        });
    
        return NextResponse.json(color);

    } catch (error) {
        console.error('[COLORS_POST]', error);
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

        const colors  = await prismadb.color.findMany({
            where: {
                storeId
            }
        });
    
        return NextResponse.json(colors);

    } catch (error) {
        console.error('[COLORS_GET]', error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}
