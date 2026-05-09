import Image from "next/image";
import { Billboard as BillboardType } from "@/types";

interface BillboardProps {
    data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
    return (
        <div className="mx-4 sm:mx-6 lg:mx-8 my-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800">
            <div className="grid md:grid-cols-2 min-h-[340px]">
                <div className="flex flex-col justify-center px-10 py-12 md:px-16 bg-gray-50 dark:bg-zinc-900 order-2 md:order-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-4">
                        New Arrivals
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 leading-tight">
                        {data?.label}
                    </h1>
                </div>
                <div className="relative min-h-[220px] order-1 md:order-2 bg-gray-200 dark:bg-zinc-800">
                    {data?.imageUrl && (
                        <Image
                            fill
                            src={data.imageUrl}
                            alt={data?.label ?? ""}
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Billboard;
