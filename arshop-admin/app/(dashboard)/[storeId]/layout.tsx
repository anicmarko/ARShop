import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ storeId: string }>
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { storeId } = await params;

    const store = await prismadb.store.findFirst({
        where: { id: storeId }
    });

    if (!store) redirect("/");

    const isOwner = store.userId === userId;

    if (!isOwner) {
        const adminRecord = await prismadb.admin.findFirst({
            where: { clerkId: userId, storeId }
        });
        if (!adminRecord) redirect("/");
    }

    const clerkUser = await currentUser();
    await prismadb.admin.upsert({
        where: { clerkId: userId },
        update: { storeId },
        create: {
            clerkId: userId,
            email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
            name: clerkUser?.fullName ?? clerkUser?.firstName ?? undefined,
            storeId,
            role: isOwner ? "OWNER" : "MANAGER",
        },
    });

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
