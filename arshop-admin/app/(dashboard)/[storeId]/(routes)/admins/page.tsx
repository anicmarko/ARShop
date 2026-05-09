import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { AdminClient } from "./components/client";
import { AdminColumn } from "./components/columns";

const AdminsPage = async ({
    params,
}: {
    params: Promise<{ storeId: string }>;
}) => {
    const { storeId } = await params;
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const currentAdmin = await prismadb.admin.findFirst({
        where: { clerkId: userId, storeId },
    });

    const admins = await prismadb.admin.findMany({
        where: { storeId },
        orderBy: { createdAt: "asc" },
    });

    const formattedAdmins: AdminColumn[] = admins.map((a) => ({
        id: a.id,
        name: a.name ?? "-",
        email: a.email,
        role: a.role,
        createdAt: format(a.createdAt, "MMMM do, yyyy"),
    }));

    const isOwner = currentAdmin?.role === "OWNER";

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AdminClient
                    data={formattedAdmins}
                    isOwner={isOwner}
                    currentAdminId={currentAdmin?.id ?? ""}
                />
            </div>
        </div>
    );
};

export default AdminsPage;
