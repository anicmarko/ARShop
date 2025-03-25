"use client";

import { Billboard } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().nonempty(),
    imageUrl: z.string().nonempty()
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: "",
        }
    });

    const title = initialData ? "Edit billboard" : "New billboard";
    const description = initialData ? "Update your billboard settings" : "Create a new billboard";
    const toastMessage = initialData ? "Billboard updated" : "Billboard created";
    const action = initialData ? "Save changes" : "Create";

    const onSubmit = async (values : BillboardFormValues) => {
        try {
            const url = initialData
            ? `/api/${params.storeId}/billboards/${params.billboardId}`
            : `/api/${params.storeId}/billboards`;

            const method = initialData ? axios.patch : axios.post;

            await method(url, values);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push("/");
            toast.success("Billboard deleted");
        } catch (error) {
            toast.error("Remove all categories first.");
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
                    <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background image</FormLabel>
                                    <FormControl>
                                        <ImageUpload 
                                            value={field.value ? [field.value] : []}
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}

                                        /> 
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard name" {...field}/>
                                    </FormControl>
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
            <Separator />
        </>
    )
}