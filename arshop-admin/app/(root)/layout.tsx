import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Redirect OWNER to their store
    const ownedStore = await prismadb.store.findFirst({
        where: { userId }
    });

    if (ownedStore) {
        redirect(`/${ownedStore.id}`);
    }

    // Redirect MANAGER to their assigned store
    const adminRecord = await prismadb.admin.findFirst({
        where: { clerkId: userId },
        include: { store: true },
    });

    if (adminRecord?.store) {
        redirect(`/${adminRecord.store.id}`);
    }

    // If any store exists in the system, this user has no access — show unauthorized
    const anyStore = await prismadb.store.findFirst();
    if (anyStore) {
        redirect("/unauthorized");
    }

    // No stores exist at all — allow initial store creation
    return <>{children}</>;
}
