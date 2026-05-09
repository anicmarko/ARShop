"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterBy: string
    total: number
    page: number
    pageSize: number
    sortableColumns?: string[]
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total]
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
    return [1, "...", current - 1, current, current + 1, "...", total]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    total,
    page,
    pageSize,
    sortableColumns = [],
}: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentSortBy  = searchParams.get("sortBy")  ?? "createdAt"
    const currentSortDir = searchParams.get("sortDir") ?? "desc"
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        setSearchValue(searchParams.get("search") ?? "")
    }, [searchParams])

    const buildUrl = (overrides: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(overrides).forEach(([k, v]) => {
            if (v === null) params.delete(k)
            else params.set(k, v)
        })
        return `${pathname}?${params.toString()}`
    }

    const handleSearch = (value: string) => {
        setSearchValue(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            router.push(buildUrl({ search: value.trim() || null, page: null }))
        }, 400)
    }

    const handleSort = (col: string) => {
        if (currentSortBy === col) {
            router.push(buildUrl({ sortDir: currentSortDir === "asc" ? "desc" : "asc", page: null }))
        } else {
            router.push(buildUrl({ sortBy: col, sortDir: "asc", page: null }))
        }
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const pageNumbers = getPageNumbers(page, totalPages)

    return (
        <div>
            {/* Search + result count */}
            <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-sm"
                />
                <p className="ml-auto text-sm text-muted-foreground tabular-nums">
                    {total} {total === 1 ? "result" : "results"}
                </p>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const colId = header.column.id
                                    const isSortable = sortableColumns.includes(colId)
                                    const isActive = currentSortBy === colId
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : isSortable ? (
                                                <button
                                                    onClick={() => handleSort(colId)}
                                                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {isActive
                                                        ? currentSortDir === "asc"
                                                            ? <ArrowUp size={13} />
                                                            : <ArrowDown size={13} />
                                                        : <ArrowUpDown size={13} className="text-muted-foreground" />
                                                    }
                                                </button>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 py-4 flex-wrap">
                    <Button
                        variant="outline" size="sm"
                        className="rounded-full w-9 h-9 p-0"
                        onClick={() => router.push(buildUrl({ page: String(page - 1) }))}
                        disabled={page <= 1}
                    >
                        <ChevronLeft size={14} />
                    </Button>

                    {pageNumbers.map((p, i) =>
                        p === "..." ? (
                            <span key={`e-${i}`} className="px-1 text-sm text-muted-foreground select-none">…</span>
                        ) : (
                            <Button
                                key={p}
                                variant={p === page ? "default" : "outline"}
                                size="sm"
                                className="rounded-full w-9 h-9 p-0"
                                onClick={() => router.push(buildUrl({ page: String(p) }))}
                            >
                                {p}
                            </Button>
                        )
                    )}

                    <Button
                        variant="outline" size="sm"
                        className="rounded-full w-9 h-9 p-0"
                        onClick={() => router.push(buildUrl({ page: String(page + 1) }))}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight size={14} />
                    </Button>
                </div>
            )}
        </div>
    )
}
