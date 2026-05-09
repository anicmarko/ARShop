import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { SizeClient } from './components/client'
import { SizeColumn } from './components/columns'

const PAGE_SIZE = 10
const VALID_SORT: Record<string, true> = { name: true, createdAt: true }

const SizesPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ storeId: string }>
    searchParams: Promise<{ page?: string; search?: string; sortBy?: string; sortDir?: string }>
}) => {
    const { storeId } = await params
    const { page, search, sortBy, sortDir } = await searchParams

    const currentPage = Math.max(1, parseInt(page ?? "1", 10))
    const skip      = (currentPage - 1) * PAGE_SIZE
    const sortField = VALID_SORT[sortBy ?? ""] ? sortBy! : "createdAt"
    const direction = sortDir === "asc" ? "asc" : "desc"

    const where = {
        storeId,
        ...(search ? { name: { contains: search } } : {}),
    }

    const [sizes, total] = await Promise.all([
        prismadb.size.findMany({
            where,
            orderBy: { [sortField]: direction },
            take: PAGE_SIZE,
            skip,
        }),
        prismadb.size.count({ where }),
    ])

    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient
                    data={formattedSizes}
                    total={total}
                    page={currentPage}
                    pageSize={PAGE_SIZE}
                />
            </div>
        </div>
    )
}

export default SizesPage
