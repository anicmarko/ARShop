"use client";

import { Suspense, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/useCart";

const Summary = () => {
    const searchParams =  useSearchParams();

    const items = useCart((state) => state.items);
    const clearCart = useCart((state) => state.clearCart);

    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price);
    }
    , 0);

    useEffect(() => {
        if(searchParams.has("success")) {
            toast.success("Checkout completed!");
            clearCart();
        }
        if(searchParams.has("canceled")) {
            toast.error("Something went wrong!");
        }
    },[searchParams, clearCart]);

    const onCheckout = async () => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`,{
            productIds: items.map((item) => item.id)
        });

        window.location.href = res.data.url;
    }

    return (
        <Suspense fallback={<div className="h-4 w-4 animate-pulse bg-gray-200 rounded-full"></div>}>
        <div 
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
                Order summary
            </h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-300 pt-4">
                    <div className="text-base font-medium text-gray-900">
                        Order total
                    </div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            <Button 
                className="w-full mt-6"
                onClick={onCheckout}
                disabled={items.length === 0}
            >
                Checkout
            </Button>
        </div>
        </Suspense>
    )
}

export default Summary;