import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: Promise<{ sizeId: string }> }
)   {
    try {    

        const { sizeId } = await params;

        if(!sizeId){
            return NextResponse.json({ error: "Billboard ID is required", status: 400});
        }


        const size = await prismadb.size.findUnique({
            where: {
                id: sizeId,
                
            }
        });

        return NextResponse.json(size);
        
    } catch (error) {
        console.error("[SIZE_GET]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: Promise<{ storeId: string ,sizeId: string }> }
)   {
    try {
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }
         
        const body = await req.json();
        const { name, value } = body;

        if(!name) {
            return NextResponse.json({ error: "Name is required", status: 400});
        }
        if(!value) {
            return NextResponse.json({ error: "Value is required", status: 400});
        }

        const { storeId, sizeId } = await params;

        if(!sizeId){
            return NextResponse.json({ error: "Size ID is required", status: 400});
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

        const size = await prismadb.size.update({
            where: {
                id: sizeId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);
        
    } catch (error) {
        console.error("[SIZE_PATCH]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: Promise<{ storeId: string, sizeId: string }> }
)   {
    try {    
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }

        const { storeId, sizeId } = await params;

        if(!sizeId){
            return NextResponse.json({ error: "Size ID is required", status: 400});
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


        const size = await prismadb.size.deleteMany({
            where: {
                id: sizeId,
                
            }
        });

        return NextResponse.json(size);
        
    } catch (error) {
        console.error("[SIZE_DELETE]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

