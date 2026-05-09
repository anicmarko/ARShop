"use client";

import IconButton from "@/components/ui/icon-button";
import { Size, Color } from "@/types";
import { Dialog, DialogPanel } from "@headlessui/react";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import FilterBar from "./filter";

interface MobileFiltersProps {
    sizes: Size[];
    colors: Color[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="flex items-center gap-x-2 lg:hidden mb-6 px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-zinc-300"
                onClick={() => setOpen(true)}
            >
                <SlidersHorizontal size={16} />
                Filters
            </button>
            <Dialog
                open={open}
                as="div"
                className="relative z-50 lg:hidden"
                onClose={() => setOpen(false)}
            >
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="fixed inset-0 z-50 flex">
                    <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 py-4 pb-6 shadow-xl">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Filters</h2>
                            <IconButton
                                icon={<X size={15} className="text-gray-600 dark:text-zinc-300" />}
                                onClick={() => setOpen(false)}
                            />
                        </div>
                        <div className="p-4">
                            <FilterBar sizes={sizes} colors={colors} />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default MobileFilters;
