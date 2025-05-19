import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: Promise<{ productId: string }> }
)   {
    try {    

        const { productId } = await params;

        if(!productId){
            return NextResponse.json({ error: "Product ID is required", status: 400});
        }


        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }   
        });

        return NextResponse.json(product);
        
    } catch (error) {
        console.error("[PRODUCT_GET]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: Promise<{ storeId: string ,productId: string }> }
)   {
    try {
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }
         
        const body = await req.json();

        const { 
            name, 
            price, 
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
         } = body;

        if(!name) {
            return NextResponse.json({ error: "Name is required", status: 400});
        }

        if(!images || !images.length) {
            return NextResponse.json({ error: "Images are required", status: 400});
        }

        if(!price) {
            return NextResponse.json({ error: "Price is required", status: 400});
        }

        if(!categoryId) {
            return NextResponse.json({ error: "Category ID is required", status: 400});
        }

        if(!sizeId) {
            return NextResponse.json({ error: "Size ID is required", status: 400});
        }

        if(!colorId) {
            return NextResponse.json({ error: "Color ID is required", status: 400});
        }

        const { storeId, productId } = await params;

        if(!productId){
            return NextResponse.json({ error: "Product ID is required", status: 400});
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

        await prismadb.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {
                    }
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where:{
                id: productId
            },
            data: {
                images: {
                    createMany: {
                        data: [...images.map((image: {url: string}) => image)]
                    }
                }
            }
        });

        return NextResponse.json(product);
        
    } catch (error) {
        console.error("[PRODUCT_PATCH]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: Promise<{ storeId: string, productId: string }> }
)   {
    try {    
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({ error: "Unauthenticated", status: 401});
        }

        const { storeId, productId } = await params;

        if(!productId){
            return NextResponse.json({ error: "Product ID is required", status: 400});
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


        const product = await prismadb.product.deleteMany({
            where: {
                id: productId,
            }
        });

        return NextResponse.json(product);
        
    } catch (error) {
        console.error("[PRODUCT_DELETE]",error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}

