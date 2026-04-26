import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = "button",
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "w-auto rounded-full bg-gray-900 dark:bg-zinc-100 border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white dark:text-zinc-900 font-semibold hover:opacity-80 transition text-sm",
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
