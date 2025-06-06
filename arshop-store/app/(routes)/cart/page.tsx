"use client";

import { Suspense, useEffect, useState } from "react";

import Container from "@/components/ui/container";
import useCart from "@/hooks/useCart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";

const CartPage = () => {
    // const [mounted, setMounted] = useState(false);
    // useEffect(() => {
    //     setMounted(true);
    // }, []);
    // if (!mounted) {
    //     return null;
    // }
    
    const cart = useCart();

    return (
        <div className="bg-white ">
            <Container>
                <div className="px-4 py-16 sm:px-6 lg:px-8 ">
                    <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                        <div className="lg:col-span-7">
                            {cart.items.length === 0 && <p className="text-neutral-500">No items added to cart</p>}
                            <ul>
                                {cart.items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        data={item}
                                    />    
                                ))}
                            </ul>
                        </div>
                        <Suspense fallback={<div className="h-4 w-4 animate-pulse bg-gray-200 rounded-full"></div>}>
                            <Summary />
                        </Suspense>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default CartPage