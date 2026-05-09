import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session.customer_details?.address;

    const addressString = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ].filter(Boolean).join(", ");

    if (event.type === "checkout.session.completed") {
        const order = await prismadb.order.update({
            where: { id: session.metadata?.orderId },
            data: {
                isPaid: true,
                address: addressString,
                phone: session.customer_details?.phone || "",
            },
            include: { orderItems: true },
        });

        // Decrement stock per ProductSize
        for (const item of order.orderItems) {
            await prismadb.productSize.updateMany({
                where: { productId: item.productId, sizeId: item.sizeId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // Fix negative stock to 0
        await prismadb.productSize.updateMany({
            where: {
                productId: { in: order.orderItems.map((i) => i.productId) },
                stock: { lt: 0 },
            },
            data: { stock: 0 },
        });

        // Archive products where ALL sizes are out of stock
        const affectedProductIds = [...new Set(order.orderItems.map((i) => i.productId))];
        for (const productId of affectedProductIds) {
            const sizes = await prismadb.productSize.findMany({ where: { productId } });
            const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);
            if (totalStock <= 0) {
                await prismadb.product.update({
                    where: { id: productId },
                    data: { isArchived: true },
                });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Unhandled event type" }, { status: 400 });
}
