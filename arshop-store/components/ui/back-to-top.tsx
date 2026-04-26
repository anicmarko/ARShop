"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={cn(
                "fixed bottom-6 right-4 sm:right-6 z-30 p-3 rounded-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg transition-all duration-300",
                visible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none"
            )}
        >
            <ArrowUp size={16} />
        </button>
    );
};

export default BackToTop;
