const Loading = () => {
    return (
        <div className="bg-white dark:bg-zinc-950">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Gallery skeleton */}
                    <div className="flex flex-col-reverse gap-4">
                        <div className="hidden sm:grid grid-cols-4 gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
                                />
                            ))}
                        </div>
                        <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                    </div>

                    {/* Info skeleton */}
                    <div className="mt-10 lg:mt-0 space-y-6">
                        <div className="h-10 w-3/4 rounded-xl bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                        <div className="h-6 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                        <hr className="border-gray-200 dark:border-zinc-800" />
                        <div className="space-y-3">
                            <div className="h-4 w-32 rounded-md bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                            <div className="h-4 w-32 rounded-md bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                        </div>
                        <div className="h-12 w-40 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    </div>
                </div>

                <hr className="my-12 border-gray-200 dark:border-zinc-800" />

                {/* Related skeleton */}
                <div>
                    <div className="mb-10 space-y-2">
                        <div className="h-3 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                        <div className="h-8 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i}>
                                <div className="aspect-[3/4] rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                                <div className="mt-3 space-y-1.5">
                                    <div className="h-3.5 rounded-md bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                                    <div className="h-3 w-2/3 rounded-md bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
