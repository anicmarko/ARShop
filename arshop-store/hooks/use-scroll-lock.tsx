import { useEffect } from "react";

interface UseScrollLockProps {
    open: boolean;
    delay?: number;
}

const useScrollLock = ({ open, delay = 200 }: UseScrollLockProps): void => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            const timeout = setTimeout(() => {
                document.body.style.overflow = "";
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [open, delay]);
};

export default useScrollLock;