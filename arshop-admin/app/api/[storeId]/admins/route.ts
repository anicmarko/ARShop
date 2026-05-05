import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

async function getOwnerAdmin(storeId: string, userId: string) {
    return prismadb.admin.findFirst({
        where: { clerkId: userId, storeId, role: "OWNER" },
    });
}

export async function GET(
    req: Request,
    props: { params: Promise<{ storeId: string }> }
) {
    const { storeId } = await props.params;
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admins = await prismadb.admin.findMany({
        where: { storeId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(admins);
}

export async function POST(
    req: Request,
    props: { params: Promise<{ storeId: string }> }
) {
    const { storeId } = await props.params;
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await getOwnerAdmin(storeId, userId);
    if (!owner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { email, role } = await req.json();

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!["OWNER", "MANAGER"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Look up Clerk user by email
    const client = await clerkClient();
    const result = await client.users.getUserList({ emailAddress: [email] });

    if (result.data.length === 0) {
        return NextResponse.json(
            { error: "No Clerk account found for this email. The user must register first." },
            { status: 404 }
        );
    }

    const clerkUserId = result.data[0].id;

    const existing = await prismadb.admin.findFirst({ where: { storeId, clerkId: clerkUserId } });
    if (existing) {
        return NextResponse.json({ error: "This user is already an admin of this store." }, { status: 409 });
    }

    const admin = await prismadb.admin.create({
        data: {
            clerkId: clerkUserId,
            email,
            name: result.data[0].fullName ?? result.data[0].firstName ?? undefined,
            role,
            storeId,
        },
    });

    return NextResponse.json(admin);
}
