"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type OrderColumn = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <div className="max-w-[320px] space-y-0.5">
        {row.original.products.split(", ").map((p, i) => (
          <p key={i} className="text-xs text-muted-foreground whitespace-nowrap">{p}</p>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <span className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        row.original.isPaid
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
      )}>
        {row.original.isPaid
          ? <><CheckCircle2 className="h-3.5 w-3.5" /> Paid</>
          : <><XCircle className="h-3.5 w-3.5" /> Unpaid</>
        }
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || <span className="text-muted-foreground text-xs">—</span>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => row.original.address || <span className="text-muted-foreground text-xs">—</span>,
  },
]
