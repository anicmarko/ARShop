import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params } : { params: Promise<{ storeId: string }> }
)   {
    try {
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }
         
        const body = await req.json();
        const { name } = body;

        if(!name) {
            return NextResponse.json({ error: "Name is required", status: 400});
        }

        const { storeId } = await params;

        if(!storeId){
            return NextResponse.json({ error: "Store ID is required", status: 400});
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);
        
    } catch (error) {
        console.error("[STORE_PATCH]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: Promise<{ storeId: string }> }
)   {
    try {
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }

        const { storeId } = await params;

        if(!storeId){
            return NextResponse.json({ error: "Store ID is required", status: 400});
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: storeId,
                userId
            }
        });

        return NextResponse.json(store);
        
    } catch (error) {
        console.error("[STORE_DELETE]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}