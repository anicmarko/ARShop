import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

interface CartItem {
    productId: string;
    sizeId: string;
    quantity: number;
}

export async function POST(req: Request, props: { params: Promise<{ storeId: string }> }) {
    const params = await props.params;

    const body = await req.json();
    const cartItems: CartItem[] = body.cartItems;
    const customerClerkId: string | undefined = body.userId;
    const customerEmail: string | undefined = body.email;
    const customerName: string | undefined = body.name;

    if (!cartItems?.length) {
        return NextResponse.json({ error: "Cart items are required" }, { status: 400, headers: corsHeaders });
    }

    const productIds = cartItems.map((i) => i.productId);

    const products = await prismadb.product.findMany({
        where: { id: { in: productIds } },
        include: { sizes: true },
    });

    // Stock validation per size
    for (const item of cartItems) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            return NextResponse.json(
                { error: `Product not found: ${item.productId}` },
                { status: 404, headers: corsHeaders }
            );
        }
        const productSize = product.sizes.find((s) => s.sizeId === item.sizeId);
        if (!productSize) {
            return NextResponse.json(
                { error: `Size not available for "${product.name}"` },
                { status: 400, headers: corsHeaders }
            );
        }
        if (productSize.stock < item.quantity) {
            return NextResponse.json(
                { error: `Insufficient stock for "${product.name}" in selected size. Available: ${productSize.stock}` },
                { status: 400, headers: corsHeaders }
            );
        }
    }

    // Upsert customer User record
    let dbUserId: string | undefined;
    if (customerClerkId && customerEmail) {
        const user = await prismadb.user.upsert({
            where: { clerkId: customerClerkId },
            update: { email: customerEmail, name: customerName },
            create: { clerkId: customerClerkId, email: customerEmail, name: customerName },
        });
        dbUserId = user.id;
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return {
            quantity: item.quantity,
            price_data: {
                currency: "rsd",
                product_data: { name: product.name },
                unit_amount: Number(product.price) * 100,
            },
        };
    });

    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            userId: dbUserId,
            orderItems: {
                create: cartItems.map((item) => ({
                    product: { connect: { id: item.productId } },
                    size: { connect: { id: item.sizeId } },
                    quantity: item.quantity,
                })),
            },
        },
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: { enabled: true },
        success_url: `${process.env.FRONTEND_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=1`,
        metadata: { orderId: order.id },
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
