const Loading = () => {
    return (
        <div className="bg-white dark:bg-zinc-950">
            {/* Hero skeleton */}
            <div className="h-[calc(100vh-64px)] min-h-[480px] bg-zinc-100 dark:bg-zinc-800 animate-pulse" />

            {/* Products skeleton */}
            <div className="py-20 px-4 sm:px-8 lg:px-16 max-w-screen-xl mx-auto">
                <div className="mb-10 space-y-2">
                    <div className="h-3 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div className="h-9 w-52 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i}>
                            <div className="aspect-[3/4] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                            <div className="mt-3 space-y-1.5 px-0.5">
                                <div className="h-3.5 rounded-md bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                                <div className="h-3 w-2/3 rounded-md bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loading;
