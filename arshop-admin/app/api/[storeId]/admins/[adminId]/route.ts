import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

async function getOwnerAdmin(storeId: string, userId: string) {
    return prismadb.admin.findFirst({
        where: { clerkId: userId, storeId, role: "OWNER" },
    });
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ storeId: string; adminId: string }> }
) {
    const { storeId, adminId } = await props.params;
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await getOwnerAdmin(storeId, userId);
    if (!owner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (owner.id === adminId) {
        return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const { role } = await req.json();
    if (!["OWNER", "MANAGER"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const admin = await prismadb.admin.update({
        where: { id: adminId },
        data: { role },
    });

    return NextResponse.json(admin);
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ storeId: string; adminId: string }> }
) {
    const { storeId, adminId } = await props.params;
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await getOwnerAdmin(storeId, userId);
    if (!owner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (owner.id === adminId) {
        return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
    }

    await prismadb.admin.delete({ where: { id: adminId } });

    return NextResponse.json({ success: true });
}
