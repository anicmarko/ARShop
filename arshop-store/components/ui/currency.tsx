"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

interface CurrencyProps {
    value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({
    value
}) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }
    , []);
    
    if (!mounted) {
        return null;
    }

    return (
        <p className="font-semibold">
            {formatter.format(Number(value))}
        </p>
    )
}

export default Currency;