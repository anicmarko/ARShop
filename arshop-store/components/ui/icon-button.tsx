import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

interface IconButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    icon: React.ReactElement;
    className?: string;
    "aria-label"?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, className, "aria-label": ariaLabel }) => {
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={cn(
                "rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm p-2 hover:scale-105 transition",
                className
            )}
        >
            {icon}
        </button>
    );
};

export default IconButton;
