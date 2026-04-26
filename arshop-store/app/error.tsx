"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen flex items-center justify-center px-4">
            <div className="text-center flex flex-col items-center gap-5 max-w-md">
                <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                    <AlertTriangle size={36} className="text-amber-500" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2">Error</p>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-2">
                        Something went wrong
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        An unexpected error occurred. Please try again.
                    </p>
                </div>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-zinc-100 px-6 py-2.5 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                    <RefreshCw size={15} aria-hidden="true" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
