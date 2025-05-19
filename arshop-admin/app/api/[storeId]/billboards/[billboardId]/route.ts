import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: Promise<{ billboardId: string }> }
)   {
    try {    

        const { billboardId } = await params;

        if(!billboardId){
            return NextResponse.json({ error: "Billboard ID is required", status: 400});
        }


        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: billboardId,
                
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.error("[BILLBOARD_GET]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: Promise<{ storeId: string ,billboardId: string }> }
)   {
    try {
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }
         
        const body = await req.json();
        const { label, imageUrl } = body;

        if(!label) {
            return NextResponse.json({ error: "Label is required", status: 400});
        }
        if(!imageUrl) {
            return NextResponse.json({ error: "Image URL is required", status: 400});
        }

        const { storeId, billboardId } = await params;

        if(!billboardId){
            return NextResponse.json({ error: "Billboard ID is required", status: 400});
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.error("[BILLBOARD_PATCH]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: Promise<{ storeId: string, billboardId: string }> }
)   {
    try {    
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }

        const { storeId, billboardId } = await params;

        if(!billboardId){
            return NextResponse.json({ error: "Billboard ID is required", status: 400});
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


        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: billboardId,
                
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.error("[BILLBOARD_DELETE]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

