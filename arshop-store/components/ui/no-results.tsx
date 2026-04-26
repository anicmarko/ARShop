"use client";

import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";

interface NoResultsProps {
    message?: string;
    showCta?: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({
    message = "No products found matching your filters.",
    showCta = true,
}) => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <PackageSearch size={28} className="text-gray-400 dark:text-zinc-500" aria-hidden="true" />
            </div>
            <div>
                <p className="font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                    No results found
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs">
                    {message}
                </p>
            </div>
            {showCta && (
                <button
                    onClick={() => router.push(window.location.pathname)}
                    className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline underline-offset-2 transition-colors"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
};

export default NoResults;
