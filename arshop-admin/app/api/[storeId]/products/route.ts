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

        const { name, price, categoryId, colorId, images, isFeatured, isArchived, sizes } = body;

        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
        if (!images?.length) return NextResponse.json({ error: "Images are required" }, { status: 400 });
        if (!price) return NextResponse.json({ error: "Price is required" }, { status: 400 });
        if (!categoryId) return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        if (!colorId) return NextResponse.json({ error: "Color ID is required" }, { status: 400 });
        if (!sizes?.length) return NextResponse.json({ error: "At least one size with stock is required" }, { status: 400 });

        const { storeId } = await params;

        const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!storeByUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                storeId,
                images: { createMany: { data: images.map((i: { url: string }) => i) } },
                sizes: {
                    createMany: {
                        data: sizes.map((s: { sizeId: string; stock: number }) => ({
                            sizeId: s.sizeId,
                            stock: s.stock,
                        })),
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCTS_POST]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId    = searchParams.get("colorId")    || undefined;
        const sizeId     = searchParams.get("sizeId")     || undefined;
        const isFeatured = searchParams.get("isFeatured");
        const name       = searchParams.get("name")       || undefined;
        const sortBy     = searchParams.get("sortBy")     || "newest";
        const take       = parseInt(searchParams.get("take") || "0", 10);
        const skip       = parseInt(searchParams.get("skip") || "0", 10);

        const { storeId } = await params;
        if (!storeId) return NextResponse.json({ error: "Store ID is required" }, { status: 400 });

        const orderBy =
            sortBy === "price-asc"  ? { price: "asc"  as const } :
            sortBy === "price-desc" ? { price: "desc" as const } :
                                     { createdAt: "desc" as const };

        const where = {
            storeId,
            categoryId,
            colorId,
            isFeatured: isFeatured ? true : undefined,
            isArchived: false,
            ...(name ? { name: { contains: name } } : {}),
            ...(sizeId ? { sizes: { some: { sizeId, stock: { gt: 0 } } } } : {}),
        };

        const [data, total] = await Promise.all([
            prismadb.product.findMany({
                where,
                include: {
                    images: true,
                    category: true,
                    color: true,
                    sizes: { include: { size: true } },
                },
                orderBy,
                ...(take > 0 ? { take, skip } : {}),
            }),
            prismadb.product.count({ where }),
        ]);

        return NextResponse.json({ data, total });
    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
