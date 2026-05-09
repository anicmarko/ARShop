"use client";

import { Category, Color, Size } from "@prisma/client";
import { Minus, Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type ProductWithSizes = {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    colorId: string;
    isFeatured: boolean;
    isArchived: boolean;
    images: { id: string; url: string }[];
    sizes: { sizeId: string; stock: number }[];
};

interface ProductFormProps {
    initialData: ProductWithSizes | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

const formSchema = z.object({
    name: z.string().nonempty(),
    images: z.object({ url: z.string().nonempty() }).array().min(1, "At least one image is required"),
    price: z.coerce.number().positive(),
    categoryId: z.string().nonempty(),
    colorId: z.string().nonempty(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    sizes: z.array(
        z.object({
            sizeId: z.string(),
            stock: z.coerce.number().int().min(0),
        })
    ).min(1, "At least one size is required"),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes: rawSizes,
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const sizes = Array.from(new Map(rawSizes.map((s) => [s.id, s])).values());

    const defaultSizes = sizes.map((s) => ({
        sizeId: s.id,
        stock: initialData?.sizes.find((ps) => ps.sizeId === s.id)?.stock ?? 0,
    }));

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                images: initialData.images,
                price: initialData.price,
                categoryId: initialData.categoryId,
                colorId: initialData.colorId,
                isFeatured: initialData.isFeatured,
                isArchived: initialData.isArchived,
                sizes: defaultSizes,
            }
            : {
                name: "",
                images: [],
                price: 0,
                categoryId: "",
                colorId: "",
                isFeatured: false,
                isArchived: false,
                sizes: defaultSizes,
            },
    });

    const { control, watch } = form;
    const { fields: imageFields, append, remove } = useFieldArray({ control, name: "images" });
    const { fields: sizeFields } = useFieldArray({ control, name: "sizes" });

    const title = initialData ? "Edit product" : "New product";
    const description = initialData ? "Update your product details" : "Add a new product to your store";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save changes" : "Create product";

    const onSubmit = async (values: ProductFormValues) => {
        try {
            setLoading(true);
            const url = initialData
                ? `/api/${params.storeId}/products/${params.productId}`
                : `/api/${params.storeId}/products`;
            const method = initialData ? axios.patch : axios.post;
            await method(url, values);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        } catch {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted.");
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
                    <div className="flex gap-8 items-stretch">

                        {/* ── Left: all fields ── */}
                        <div className="w-[560px] shrink-0 space-y-5">

                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="e.g. Classic White Tee" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Price · Category · Color */}
                            <div className="grid grid-cols-3 gap-3">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (RSD)</FormLabel>
                                            <FormControl>
                                                <Input type="number" disabled={loading} placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl className="w-full">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((c) => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="colorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Color</FormLabel>
                                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl className="w-full">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {colors.map((c) => (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            <span className="flex items-center gap-2">
                                                                <span className="h-3 w-3 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: c.value }} />
                                                                {c.name}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Visibility */}
                            <div className="flex items-center gap-6">
                                <FormField
                                    control={form.control}
                                    name="isFeatured"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="flex cursor-pointer items-center gap-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <span className="text-sm font-medium">Featured</span>
                                            </label>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isArchived"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="flex cursor-pointer items-center gap-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <span className="text-sm font-medium">Archived</span>
                                            </label>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            {/* Inventory */}
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Inventory
                                </p>
                                {sizeFields.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No sizes defined yet.</p>
                                ) : (
                                    <div className="flex gap-3">
                                        {sizeFields.map((field, index) => {
                                            const size = sizes.find((s) => s.id === field.sizeId);
                                            const stock = Number(watch(`sizes.${index}.stock`) ?? 0);
                                            const isOut = stock === 0;
                                            const isLow = stock > 0 && stock <= 4;

                                            return (
                                                <FormField
                                                    key={field.id}
                                                    control={form.control}
                                                    name={`sizes.${index}.stock`}
                                                    render={({ field: sf }) => {
                                                        const val = Number(sf.value ?? 0);
                                                        return (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <div className={cn(
                                                                        "flex flex-col items-center gap-2 rounded-xl border py-4 transition-opacity",
                                                                        isOut ? "opacity-50" : "opacity-100",
                                                                        isLow && "border-amber-500/40 bg-amber-500/5"
                                                                    )}>
                                                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                                            {size?.value}
                                                                        </span>
                                                                        <input
                                                                            type="number"
                                                                            min={0}
                                                                            disabled={loading}
                                                                            value={sf.value}
                                                                            onChange={(e) => sf.onChange(Math.max(0, e.target.valueAsNumber || 0))}
                                                                            className="w-12 bg-transparent text-center text-2xl font-black tabular-nums focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                                        />
                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                type="button"
                                                                                disabled={loading || val <= 0}
                                                                                onClick={() => sf.onChange(Math.max(0, val - 1))}
                                                                                className="flex h-6 w-6 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                                                            >
                                                                                <Minus className="h-3 w-3" />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                disabled={loading}
                                                                                onClick={() => sf.onChange(val + 1)}
                                                                                className="flex h-6 w-6 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                                            >
                                                                                <Plus className="h-3 w-3" />
                                                                            </button>
                                                                        </div>
                                                                        <span className={cn(
                                                                            "text-[10px] font-semibold",
                                                                            isOut ? "text-muted-foreground" : isLow ? "text-amber-500" : "text-emerald-500"
                                                                        )}>
                                                                            {isOut ? "out" : isLow ? "low" : "ok"}
                                                                        </span>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage className="text-center text-xs" />
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <Button disabled={loading} type="submit" className="w-full">
                                {action}
                            </Button>
                        </div>

                        {/* ── Right: images ── */}
                        <div className="flex-1 min-w-0 flex flex-col">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
                                Photos
                            </p>
                            <div className="flex-1 min-h-0 flex flex-col">
                                <ImageUpload
                                    value={imageFields.map((i) => i.url)}
                                    disabled={loading}
                                    onChange={(url) => append({ url })}
                                    onRemove={(url) => {
                                        const idx = imageFields.findIndex((i) => i.url === url);
                                        if (idx !== -1) remove(idx);
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={() => <FormMessage className="mt-1" />}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
};
