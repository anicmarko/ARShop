import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const stores = await prismadb.store.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(stores);

    } catch (error) {
        console.error("[STORES_GET]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { name } = body;

        if(!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401});
        }

        if(!name) {
            return NextResponse.json({ error: "Store name is required", status: 400});
        }

        const store  = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });
    
        return NextResponse.json(store);

    } catch (error) {
        console.error('[STORES_POST]', error);
        return NextResponse.json({ error: "Internal error", status: 500});
    }
}