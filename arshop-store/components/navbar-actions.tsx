"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const NavbarActions = () => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cart = useCart();
    const router = useRouter();
    
    if (!mounted) {
        return null;
    }

    return (
        <div className="ml-auto flex items-center gap-x-4">
            <Button 
                className="flex items-center rounded-full bg-black px-4 py-2"
                onClick={() => router.push("/cart")}    
            >
                <ShoppingBag
                    size={20}
                    className="white"
                />
                <span className="ml-2 text-sm font-medium text-white">
                    {cart.items.length}
                </span>
            </Button>
        </div>
    )
}

export default NavbarActions;