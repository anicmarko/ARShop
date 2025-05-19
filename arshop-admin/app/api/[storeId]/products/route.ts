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

        if(!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401});
        }

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
        const product  = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        });
    
        return NextResponse.json(product);

    } catch (error) {
        console.error('[PRODUCTS_POST]', error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}
export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }

) {
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        const { storeId }= await params;

        if(!storeId) {
            return NextResponse.json({ error: "Store ID is required", status: 400});
        }

        const products  = await prismadb.product.findMany({
            where: {
                storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    
        return NextResponse.json(products);

    } catch (error) {
        console.error('[PRODUCTS_GET]', error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}
