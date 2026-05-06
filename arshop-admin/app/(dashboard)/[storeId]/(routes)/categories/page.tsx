import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { CategoryClient } from './components/client'
import { CategoryColumn } from './components/columns'

const PAGE_SIZE = 10
const VALID_SORT: Record<string, true> = { name: true, createdAt: true }

const CategoriesPage = async ({
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

    const [categories, total] = await Promise.all([
        prismadb.category.findMany({
            where,
            include: { billboard: true },
            orderBy: { [sortField]: direction },
            take: PAGE_SIZE,
            skip,
        }),
        prismadb.category.count({ where }),
    ])

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient
                    data={formattedCategories}
                    total={total}
                    page={currentPage}
                    pageSize={PAGE_SIZE}
                />
            </div>
        </div>
    )
}

export default CategoriesPage
