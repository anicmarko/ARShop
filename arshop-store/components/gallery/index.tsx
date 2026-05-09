"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import { Image as ImageType } from "@/types";
import { cn } from "@/lib/utils";

interface GalleryProps {
    images: ImageType[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const [selected, setSelected] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!images || images.length === 0) return null;

    const scrollTo = (index: number) => {
        const clamped = Math.max(0, Math.min(images.length - 1, index));
        setSelected(clamped);
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: clamped * scrollRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const index = Math.round(
            scrollRef.current.scrollLeft / scrollRef.current.clientWidth
        );
        setSelected(index);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {/* ── Main image area ── */}
                <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-800">
                    {/* Mobile: horizontal scroll-snap carousel */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex sm:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar aspect-square"
                    >
                        {images.map((img, i) => (
                            <div
                                key={img.id}
                                className="relative shrink-0 w-full aspect-square snap-start"
                            >
                                <Image
                                    fill
                                    src={img.url}
                                    alt={`Product photo ${i + 1}`}
                                    sizes="100vw"
                                    className="object-cover"
                                    priority={i === 0}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Desktop: single selected image with zoom on click */}
                    <div
                        className="hidden sm:block relative aspect-square w-full cursor-zoom-in group"
                        onClick={() => setZoomed(true)}
                        role="button"
                        aria-label="Klikni za zumiranje slike"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setZoomed(true)}
                    >
                        <Image
                            fill
                            key={images[selected].id}
                            src={images[selected].url}
                            alt={`Product photo ${selected + 1}`}
                            sizes="(max-width: 1024px) 50vw, 600px"
                            className="object-cover transition-opacity duration-150"
                            priority={selected === 0}
                        />
                        {/* Zoom hint */}
                        <div className="absolute top-3 right-3 p-2 rounded-full bg-white/70 dark:bg-zinc-800/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ZoomIn size={14} className="text-gray-700 dark:text-zinc-300" />
                        </div>
                    </div>

                    {/* Mobile prev/next arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => scrollTo(selected - 1)}
                                aria-label="Prethodna slika"
                                className={cn(
                                    "sm:hidden absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white backdrop-blur-sm transition-opacity",
                                    selected === 0 && "opacity-0 pointer-events-none"
                                )}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scrollTo(selected + 1)}
                                aria-label="Sledeća slika"
                                className={cn(
                                    "sm:hidden absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white backdrop-blur-sm transition-opacity",
                                    selected === images.length - 1 && "opacity-0 pointer-events-none"
                                )}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </>
                    )}

                    {/* Mobile dot indicators */}
                    {images.length > 1 && (
                        <div className="sm:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                            {images.map((_, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "h-1.5 rounded-full bg-white transition-all duration-200",
                                        selected === i ? "w-5 opacity-100" : "w-1.5 opacity-50"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Desktop thumbnails ── */}
                {images.length > 1 && (
                    <div className="hidden sm:grid grid-cols-4 gap-2.5">
                        {images.map((img, i) => (
                            <button
                                key={img.id}
                                onClick={() => setSelected(i)}
                                aria-label={`Prikaži sliku ${i + 1}`}
                                className={cn(
                                    "relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 transition-all",
                                    selected === i
                                        ? "ring-gray-900 dark:ring-zinc-100"
                                        : "ring-transparent hover:ring-gray-300 dark:hover:ring-zinc-600"
                                )}
                            >
                                <Image
                                    fill
                                    src={img.url}
                                    alt={`Thumbnail ${i + 1}`}
                                    sizes="120px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Zoom lightbox (desktop only) ── */}
            {zoomed && (
                <ZoomLightbox
                    images={images}
                    initialIndex={selected}
                    onClose={() => setZoomed(false)}
                />
            )}
        </>
    );
};

interface LightboxProps {
    images: ImageType[];
    initialIndex: number;
    onClose: () => void;
}

const ZoomLightbox: React.FC<LightboxProps> = ({ images, initialIndex, onClose }) => {
    const [current, setCurrent] = useState(initialIndex);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
            if (e.key === "ArrowRight") setCurrent((c) => Math.min(images.length - 1, c + 1));
        };
        window.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [images.length, onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close */}
            <button
                onClick={onClose}
                aria-label="Zatvori"
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
                <X size={22} />
            </button>

            {/* Image */}
            <div
                className="relative max-w-4xl max-h-[90vh] w-full h-full mx-8"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    fill
                    src={images[current].url}
                    alt={`Product photo ${current + 1}`}
                    sizes="90vw"
                    className="object-contain"
                    priority
                />
            </div>

            {/* Prev/Next */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrent((c) => Math.max(0, c - 1)); }}
                        aria-label="Prethodna slika"
                        className={cn(
                            "absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors",
                            current === 0 && "opacity-30 pointer-events-none"
                        )}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrent((c) => Math.min(images.length - 1, c + 1)); }}
                        aria-label="Sledeća slika"
                        className={cn(
                            "absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors",
                            current === images.length - 1 && "opacity-30 pointer-events-none"
                        )}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Counter */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {current + 1} / {images.length}
            </p>
        </div>
    );
};

export default Gallery;
