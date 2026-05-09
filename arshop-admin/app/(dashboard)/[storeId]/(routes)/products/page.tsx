import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const PAGE_SIZE = 10

const VALID_SORT: Record<string, true> = {
    name: true, price: true, createdAt: true,
    isFeatured: true, isArchived: true,
}

const ProductsPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ storeId: string }>
    searchParams: Promise<{ page?: string; search?: string; sortBy?: string; sortDir?: string }>
}) => {
    const { storeId } = await params
    const { page, search, sortBy, sortDir } = await searchParams

    const currentPage = Math.max(1, parseInt(page ?? "1", 10))
    const skip        = (currentPage - 1) * PAGE_SIZE
    const sortField   = VALID_SORT[sortBy ?? ""] ? sortBy! : "createdAt"
    const direction   = sortDir === "asc" ? "asc" : "desc"

    const where = {
        storeId,
        ...(search ? { name: { contains: search } } : {}),
    }

    const [products, total] = await Promise.all([
        prismadb.product.findMany({
            where,
            include: { category: true, color: true, sizes: { include: { size: true } } },
            orderBy: { [sortField]: direction },
            take: PAGE_SIZE,
            skip,
        }),
        prismadb.product.count({ where }),
    ])

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        totalStock: item.sizes.reduce((sum, s) => sum + s.stock, 0),
        sizes: item.sizes.map((s) => `${s.size.name}(${s.stock})`).join(', '),
        category: item.category.name,
        color: item.color.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient
                    data={formattedProducts}
                    total={total}
                    page={currentPage}
                    pageSize={PAGE_SIZE}
                />
            </div>
        </div>
    )
}

export default ProductsPage
