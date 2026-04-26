const Loading = () => {
    return (
        <div className="bg-white dark:bg-zinc-950">
            {/* Category header skeleton */}
            <div className="h-56 sm:h-72 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 pb-24">
                {/* Filter bar skeleton */}
                <div className="flex items-center gap-3 py-4 border-b border-gray-200 dark:border-zinc-800 mb-8">
                    <div className="h-4 w-14 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div className="h-7 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div className="h-7 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                </div>

                {/* Products skeleton */}
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
