"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal, Shield, ShieldOff, Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

import { AdminColumn } from "./columns";

interface CellActionProps {
    data: AdminColumn;
    isOwner: boolean;
    currentAdminId: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, isOwner, currentAdminId }) => {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const isSelf = data.id === currentAdminId;

    const onChangeRole = async () => {
        try {
            setLoading(true);
            const newRole = data.role === "OWNER" ? "MANAGER" : "OWNER";
            await axios.patch(`/api/${params.storeId}/admins/${data.id}`, { role: newRole });
            router.refresh();
            toast.success("Role updated");
        } catch {
            toast.error("Failed to update role");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/admins/${data.id}`);
            router.refresh();
            toast.success("Admin removed");
        } catch {
            toast.error("Failed to remove admin");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    if (!isOwner || isSelf) return null;

    return (
        <>
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={onChangeRole} disabled={loading}>
                        {data.role === "MANAGER" ? (
                            <><Shield className="mr-2 h-4 w-4" /> Promote to Owner</>
                        ) : (
                            <><ShieldOff className="mr-2 h-4 w-4" /> Demote to Manager</>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
