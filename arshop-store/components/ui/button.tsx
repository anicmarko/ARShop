import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    
}

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
                "w-auto rounded-3xl bg-black border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold hover:opacity-75 transition",
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