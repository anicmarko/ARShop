import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen flex items-center justify-center px-4">
            <div className="text-center flex flex-col items-center gap-5 max-w-md">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <SearchX size={36} className="text-gray-400 dark:text-zinc-500" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-violet-600 mb-2">404</p>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-2">
                        Page not found
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-zinc-100 px-6 py-2.5 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft size={15} aria-hidden="true" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
