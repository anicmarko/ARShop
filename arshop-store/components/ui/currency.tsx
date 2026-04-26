"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("sr-RS", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

interface CurrencyProps {
    value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({ value }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <p className="font-semibold text-gray-900 dark:text-zinc-100">
            {formatter.format(Number(value))} RSD
        </p>
    );
};

export default Currency;
