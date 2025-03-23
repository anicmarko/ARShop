"use client";

import { StoreModal } from "@/components/modals/store-modal";

import { useState, useEffect } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // For avoiding hydration error 
    if(!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    );

};
