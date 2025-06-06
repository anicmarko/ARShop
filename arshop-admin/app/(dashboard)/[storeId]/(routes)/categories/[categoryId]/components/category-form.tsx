"use client";

import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    Form, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl, 
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[]; 
}

const formSchema = z.object({
    name: z.string().nonempty(),
    billboardId: z.string().nonempty()
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            billboardId: "",
        }
    });

    const title = initialData ? "Edit category" : "New category";
    const description = initialData ? "Update your category settings" : "Create a new category";
    const toastMessage = initialData ? "Category updated" : "Category created";
    const action = initialData ? "Save changes" : "Create";

    const onSubmit = async (values : CategoryFormValues) => {
        try {
            setLoading(true);
            const url = initialData
            ? `/api/${params.storeId}/categories/${params.categoryId}`
            : `/api/${params.storeId}/categories`;

            const method = initialData ? axios.patch : axios.post;

            await method(url, values);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Remove all products first.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setOpen(true)}
                    disabled={loading}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                    >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}