import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: Promise<{ colorId: string }> }
)   {
    try {    

        const { colorId } = await params;

        if(!colorId){
            return NextResponse.json({ error: "Color ID is required", status: 400});
        }


        const color = await prismadb.color.findUnique({
            where: {
                id: colorId,  
            }
        });

        return NextResponse.json(color);
        
    } catch (error) {
        console.error("[COLOR_GET]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: Promise<{ storeId: string, colorId: string }> }
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

        const { storeId, colorId } = await params;

        if(!colorId){
            return NextResponse.json({ error: "Color ID is required", status: 400});
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

        const color = await prismadb.color.update({
            where: {
                id: colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
        
    } catch (error) {
        console.error("[COLOR_PATCH]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: Promise<{ storeId: string, colorId: string }> }
)   {
    try {    
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }

        const { storeId, colorId } = await params;

        if(!colorId){
            return NextResponse.json({ error: "Color ID is required", status: 400});
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


        const color = await prismadb.color.deleteMany({
            where: {
                id: colorId,
                
            }
        });

        return NextResponse.json(color);
        
    } catch (error) {
        console.error("[COLOR_DELETE]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

