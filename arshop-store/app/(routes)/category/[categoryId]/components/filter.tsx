"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { cn } from "@/lib/utils";
import { Color, Size } from "@/types";

interface FilterBarProps {
    sizes: Size[];
    colors: Color[];
    productCount?: number;
}

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortKey, string> = {
    newest: "Newest",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
};

const FilterBar: React.FC<FilterBarProps> = ({ sizes, colors, productCount }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState<"sizes" | "colors" | "sort" | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const selectedSize = searchParams.get("sizeId");
    const selectedColor = searchParams.get("colorId");
    const selectedSort = (searchParams.get("sortBy") as SortKey) ?? "newest";

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const setParam = (key: string, value: string | null) => {
        const current = qs.parse(searchParams.toString());
        const query = { ...current, [key]: value };
        router.push(
            qs.stringifyUrl({ url: window.location.pathname, query }, { skipNull: true })
        );
        setOpen(null);
    };

    const clearAll = () => router.push(window.location.pathname);

    const hasFilters = !!(selectedSize || selectedColor || selectedSort !== "newest");

    const triggerClass = (active: boolean) =>
        cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors select-none",
            active
                ? "bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent"
                : "bg-white dark:bg-zinc-950 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-gray-500 dark:hover:border-zinc-500"
        );

    const dropdownClass =
        "absolute top-full left-0 mt-2 z-50 min-w-[160px] rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl p-1.5";

    const optionClass = (active: boolean) =>
        cn(
            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
            active
                ? "bg-gray-100 dark:bg-zinc-800 font-semibold text-gray-900 dark:text-zinc-100"
                : "text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
        );

    return (
        <div
            ref={ref}
            className="flex items-center gap-2 flex-wrap py-4 border-b border-gray-200 dark:border-zinc-800 mb-8"
        >
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-zinc-400 mr-1">
                <SlidersHorizontal size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Filter</span>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
                <button
                    className={triggerClass(selectedSort !== "newest")}
                    onClick={() => setOpen(open === "sort" ? null : "sort")}
                    aria-expanded={open === "sort"}
                    aria-haspopup="listbox"
                >
                    {SORT_LABELS[selectedSort]}
                    <ChevronDown
                        size={12}
                        className={cn("transition-transform duration-200", open === "sort" && "rotate-180")}
                    />
                </button>
                {open === "sort" && (
                    <div className={dropdownClass} role="listbox">
                        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                            <button
                                key={key}
                                role="option"
                                aria-selected={selectedSort === key}
                                onClick={() => setParam("sortBy", key === "newest" ? null : key)}
                                className={optionClass(selectedSort === key)}
                            >
                                {SORT_LABELS[key]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sizes dropdown */}
            {sizes.length > 0 && (
                <div className="relative">
                    <button
                        className={triggerClass(!!selectedSize)}
                        onClick={() => setOpen(open === "sizes" ? null : "sizes")}
                        aria-expanded={open === "sizes"}
                        aria-haspopup="listbox"
                    >
                        {selectedSize ? (sizes.find((s) => s.id === selectedSize)?.name ?? "Size") : "Size"}
                        {selectedSize ? (
                            <X
                                size={12}
                                onClick={(e) => { e.stopPropagation(); setParam("sizeId", null); }}
                                aria-label="Clear size filter"
                            />
                        ) : (
                            <ChevronDown
                                size={12}
                                className={cn("transition-transform duration-200", open === "sizes" && "rotate-180")}
                            />
                        )}
                    </button>
                    {open === "sizes" && (
                        <div className={dropdownClass} role="listbox">
                            {sizes.map((size) => (
                                <button
                                    key={size.id}
                                    role="option"
                                    aria-selected={selectedSize === size.id}
                                    onClick={() => setParam("sizeId", selectedSize === size.id ? null : size.id)}
                                    className={optionClass(selectedSize === size.id)}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Colors dropdown */}
            {colors.length > 0 && (
                <div className="relative">
                    <button
                        className={triggerClass(!!selectedColor)}
                        onClick={() => setOpen(open === "colors" ? null : "colors")}
                        aria-expanded={open === "colors"}
                        aria-haspopup="listbox"
                    >
                        {selectedColor && (
                            <span
                                className="h-3 w-3 rounded-full border border-white/30 shrink-0"
                                style={{ backgroundColor: colors.find((c) => c.id === selectedColor)?.value }}
                                aria-hidden="true"
                            />
                        )}
                        {selectedColor ? (colors.find((c) => c.id === selectedColor)?.name ?? "Color") : "Color"}
                        {selectedColor ? (
                            <X
                                size={12}
                                onClick={(e) => { e.stopPropagation(); setParam("colorId", null); }}
                                aria-label="Clear color filter"
                            />
                        ) : (
                            <ChevronDown
                                size={12}
                                className={cn("transition-transform duration-200", open === "colors" && "rotate-180")}
                            />
                        )}
                    </button>
                    {open === "colors" && (
                        <div className={dropdownClass} role="listbox">
                            {colors.map((color) => (
                                <button
                                    key={color.id}
                                    role="option"
                                    aria-selected={selectedColor === color.id}
                                    onClick={() => setParam("colorId", selectedColor === color.id ? null : color.id)}
                                    className={cn(
                                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                                        selectedColor === color.id
                                            ? "bg-gray-100 dark:bg-zinc-800 font-semibold text-gray-900 dark:text-zinc-100"
                                            : "text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    <span
                                        className="h-4 w-4 rounded-full border border-gray-300 dark:border-zinc-600 shrink-0"
                                        style={{ backgroundColor: color.value }}
                                        aria-hidden="true"
                                    />
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {hasFilters && (
                <button
                    onClick={clearAll}
                    className="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
                >
                    Clear all
                </button>
            )}

            {/* Product count — pushes right on larger screens */}
            {productCount !== undefined && (
                <p className="ml-auto text-sm text-gray-400 dark:text-zinc-500 tabular-nums">
                    {productCount} {productCount === 1 ? "product" : "products"}
                </p>
            )}
        </div>
    );
};

export default FilterBar;
