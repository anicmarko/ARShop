"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { AdminColumn } from "./columns";
import { CellAction } from "./cell-action";

interface AdminClientProps {
    data: AdminColumn[];
    isOwner: boolean;
    currentAdminId: string;
}

export const AdminClient: React.FC<AdminClientProps> = ({ data, isOwner, currentAdminId }) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"OWNER" | "MANAGER">("MANAGER");

    const onAdd = async () => {
        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }
        try {
            setLoading(true);
            await axios.post(`/api/${params.storeId}/admins`, { email: email.trim(), role });
            router.refresh();
            toast.success("Admin added successfully.");
            setOpen(false);
            setEmail("");
            setRole("MANAGER");
        } catch (err: any) {
            toast.error(err.response?.data?.error ?? "Failed to add admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title="Add Admin"
                description="Enter the email of a registered user to give them admin access to this store."
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Role</Label>
                        <Select
                            value={role}
                            onValueChange={(v) => setRole(v as "OWNER" | "MANAGER")}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="OWNER">Owner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={onAdd} disabled={loading}>
                            Add Admin
                        </Button>
                    </div>
                </div>
            </Modal>

            <div className="flex items-center justify-between">
                <Heading
                    title={`Admins (${data.length})`}
                    description="Manage who has access to this store"
                />
                {isOwner && (
                    <Button onClick={() => setOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Admin
                    </Button>
                )}
            </div>
            <Separator />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((admin) => (
                        <TableRow key={admin.id}>
                            <TableCell>{admin.name}</TableCell>
                            <TableCell>{admin.email}</TableCell>
                            <TableCell>
                                <Badge variant={admin.role === "OWNER" ? "default" : "secondary"}>
                                    {admin.role}
                                </Badge>
                            </TableCell>
                            <TableCell>{admin.createdAt}</TableCell>
                            <TableCell>
                                <CellAction
                                    data={admin}
                                    isOwner={isOwner}
                                    currentAdminId={currentAdminId}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No admins found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};
