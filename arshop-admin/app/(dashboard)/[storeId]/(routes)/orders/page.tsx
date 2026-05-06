import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { OrderClient } from './components/client'
import { OrderColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const PAGE_SIZE = 10
const VALID_SORT: Record<string, true> = { createdAt: true, isPaid: true }

const OrdersPage = async ({
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
        ...(search ? {
            OR: [
                { phone:   { contains: search } },
                { address: { contains: search } },
                { user: { name:  { contains: search } } },
                { user: { email: { contains: search } } },
            ],
        } : {}),
    }

    const [orders, total] = await Promise.all([
        prismadb.order.findMany({
            where,
            include: {
                user: true,
                orderItems: { include: { product: true } },
            },
            orderBy: { [sortField]: direction },
            take: PAGE_SIZE,
            skip,
        }),
        prismadb.order.count({ where }),
    ])

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        customer: item.user ? (item.user.name || item.user.email) : 'Guest',
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((oi) => `${oi.product.name} x${oi.quantity}`).join(', '),
        totalPrice: formatter.format(
            item.orderItems.reduce((sum, oi) => sum + Number(oi.product.price) * oi.quantity, 0)
        ),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient
                    data={formattedOrders}
                    total={total}
                    page={currentPage}
                    pageSize={PAGE_SIZE}
                />
            </div>
        </div>
    )
}

export default OrdersPage
