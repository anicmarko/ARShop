import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: Promise<{ categoryId: string }> }
)   {
    try {    

        const { categoryId } = await params;

        if(!categoryId){
            return NextResponse.json({ error: "Category ID is required", status: 400});
        }


        const category = await prismadb.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                billboard: true
            }
        });

        return NextResponse.json(category);
        
    } catch (error) {
        console.error("[CATEGORY_GET]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: Promise<{ storeId: string ,categoryId: string }> }
)   {
    try {
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }
         
        const body = await req.json();
        const { name, billboardId } = body;

        if(!name) {
            return NextResponse.json({ error: "Name is required", status: 400});
        }
        if(!billboardId) {
            return NextResponse.json({ error: "Billboard ID is required", status: 400});
        }

        const { storeId, categoryId } = await params;

        if(!categoryId){
            return NextResponse.json({ error: "Category ID is required", status: 400});
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

        const category = await prismadb.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);
        
    } catch (error) {
        console.error("[CATEGORY_PATCH]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: Promise<{ storeId: string, categoryId: string }> }
)   {
    try {    
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }

        const { storeId, categoryId } = await params;

        if(!categoryId){
            return NextResponse.json({ error: "Category ID is required", status: 400});
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


        const category = await prismadb.category.deleteMany({
            where: {
                id: categoryId
            }
        });

        return NextResponse.json(category);
        
    } catch (error) {
        console.error("[CATEGORY_DELETE]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

