"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
    const [mounted, setMounted] = useState(false);
    const [index, setIndex] = useState(0);
    useEffect(() => { setMounted(true); }, []);

    const safeIndex = value.length > 0 ? Math.min(index, value.length - 1) : 0;
    const activeUrl = value[safeIndex] ?? null;

    if (!mounted) return null;

    return (
        <CldUploadWidget onSuccess={(result: any) => onChange(result.info.secure_url)} uploadPreset="qif08pke">
            {({ open }) => (
                <div className="flex flex-col flex-1 gap-3">

                    {/* ── Main preview ── */}
                    <div
                        className={cn(
                            "group relative flex-1 min-h-0 overflow-hidden rounded-xl border bg-muted transition-colors",
                            !activeUrl && "border-dashed border-muted-foreground/30 cursor-pointer hover:border-primary/50"
                        )}
                        onClick={!activeUrl ? () => open() : undefined}
                    >
                        {activeUrl ? (
                            <>
                                <Image
                                    fill
                                    className="object-contain"
                                    alt="preview"
                                    src={activeUrl}
                                    sizes="(max-width: 1920px) 55vw"
                                />

                                {/* Left arrow */}
                                {safeIndex > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setIndex(i => i - 1)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/75"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                )}

                                {/* Right arrow */}
                                {safeIndex < value.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setIndex(i => i + 1)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/75"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                )}

                                {/* Cover badge */}
                                {safeIndex === 0 && (
                                    <span className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white tracking-wide backdrop-blur-sm">
                                        Cover photo
                                    </span>
                                )}

                                {/* Counter */}
                                {value.length > 1 && (
                                    <span className="absolute bottom-3 right-3 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white tabular-nums backdrop-blur-sm">
                                        {safeIndex + 1} / {value.length}
                                    </span>
                                )}

                                {/* Delete */}
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => {
                                        onRemove(activeUrl);
                                        setIndex(i => Math.max(0, i - 1));
                                    }}
                                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/85"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                                <ImagePlus className="h-10 w-10" />
                                <div className="text-center">
                                    <p className="text-sm font-medium">Add product photos</p>
                                    <p className="text-xs opacity-50 mt-0.5">Click to upload</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Thumbnail strip ── */}
                    <div className="flex gap-2 shrink-0 overflow-x-auto pb-0.5">
                        {value.map((url, i) => (
                            <button
                                key={url}
                                type="button"
                                onClick={() => setIndex(i)}
                                className={cn(
                                    "group/thumb relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-all",
                                    i === safeIndex
                                        ? "border-primary ring-1 ring-primary/20"
                                        : "border-transparent opacity-55 hover:opacity-90 hover:border-muted-foreground/30"
                                )}
                            >
                                <Image fill className="object-cover" alt={`photo ${i + 1}`} src={url} sizes="68px" />
                                {i === 0 && (
                                    <span className="absolute bottom-0.5 left-0.5 rounded bg-black/65 px-1 py-px text-[7px] font-bold uppercase tracking-wide text-white leading-tight">
                                        Cover
                                    </span>
                                )}
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(url);
                                        setIndex(prev => Math.max(0, prev - 1));
                                    }}
                                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover/thumb:opacity-100 hover:bg-black/90"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </button>
                        ))}

                        {/* Add */}
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => open()}
                            className={cn(
                                "h-[68px] w-[68px] shrink-0 rounded-lg border-2 border-dashed border-muted-foreground/25",
                                "flex flex-col items-center justify-center gap-1 text-muted-foreground",
                                "transition-colors hover:border-primary/50 hover:text-foreground",
                                "disabled:cursor-not-allowed disabled:opacity-40"
                            )}
                        >
                            <ImagePlus className="h-4 w-4" />
                            <span className="text-[9px] font-medium">Add</span>
                        </button>
                    </div>

                </div>
            )}
        </CldUploadWidget>
    );
};

export default ImageUpload;
