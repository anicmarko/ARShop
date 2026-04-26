import Image from "next/image";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Image as ImageType } from "@/types";

interface GalleryTabProps {
    image: ImageType;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
    return (
        <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden">
            {({ selected }) => (
                <div className="absolute inset-0">
                    <Image
                        fill
                        src={image.url}
                        alt=""
                        sizes="auto"
                        className="object-cover object-center"
                    />
                    <span
                        className={cn(
                            "absolute inset-0 rounded-xl ring-2 ring-offset-2 transition",
                            selected
                                ? "ring-gray-900 dark:ring-zinc-100"
                                : "ring-transparent"
                        )}
                    />
                </div>
            )}
        </Tab>
    );
};

export default GalleryTab;
