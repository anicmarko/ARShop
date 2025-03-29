"use client";

import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Size, Color } from "@/types";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import Filter from "./filter";

interface MobileFiltersProps {
    sizes: Size[];
    colors: Color[];
}
const MobileFilters: React.FC<MobileFiltersProps> = ({
    sizes,
    colors
}) => {
    const [open, setOpen] = useState(false);

    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);

    return (
        <>
            <Button 
                className="flex items-center gap-x-2 lg:hidden"
                onClick={onOpen}
            >
                Filters
                <Plus size={20}/>
            </Button>
            <Dialog 
                open={open} 
                as="div" 
                className="relative z-50 lg:hidden"
                onClose={onClose}
            >
                    <div className="fixed inset-0 bg-black opacity-25" />
                    <div className="fixed inset-0 z-50 flex">
                        <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                            <div className="flex items-center justify-end px-4">
                                <IconButton
                                    icon={<X size={15} />}
                                    onClick={onClose}
                                />
                            </div>
                            <div className="p-4">
                                <Filter
                                    valueKey="sizeId"
                                    name="Sizes"
                                    data={sizes}
                                />
                                <Filter
                                    valueKey="colorId"
                                    name="Colors"
                                    data={colors}
                                />
                            </div>
                        </DialogPanel>
                    </div>
            </Dialog>
        </>
    )
}

export default MobileFilters