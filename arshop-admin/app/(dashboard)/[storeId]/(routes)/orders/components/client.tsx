"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
    data: OrderColumn[];
    total: number;
    page: number;
    pageSize: number;
}

export const OrderClient: React.FC<OrderClientProps> = ({ data, total, page, pageSize }) => {
    return (
        <>
            <Heading
                title={`Orders (${total})`}
                description="Manage your orders here"
            />
            <Separator />
            <DataTable
                filterBy="products"
                columns={columns}
                data={data}
                total={total}
                page={page}
                pageSize={pageSize}
                sortableColumns={["createdAt", "isPaid"]}
            />
        </>
    );
};
