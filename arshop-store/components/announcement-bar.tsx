"use client";

import { useEffect, useState } from "react";
import { X, Truck } from "lucide-react";

const STORAGE_KEY = "arshop-announcement-v1";

const AnnouncementBar = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) setVisible(true);
    }, []);

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, "1");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="banner"
            className="bg-violet-600 dark:bg-violet-700 text-white relative flex items-center justify-center px-10 py-2.5"
        >
            <div className="flex items-center gap-2 text-sm font-medium">
                <Truck size={15} aria-hidden="true" className="shrink-0" />
                <span>
                    Free shipping on orders over{" "}
                    <strong>$50</strong> · New arrivals every week
                </span>
            </div>
            <button
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
                <X size={13} />
            </button>
        </div>
    );
};

export default AnnouncementBar;
