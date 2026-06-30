"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonProps extends ButtonProps {
    href: string;
    children: React.ReactNode;
}

export function NavigationButton({ href, children, className, ...props }: NavigationButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Prevent multiple clicks while loading
        if (isLoading || isPending) return;

        setIsLoading(true);
        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <Button
            className={cn("relative transition-all duration-200", className)}
            onClick={handleClick}
            disabled={isLoading || isPending || props.disabled}
            {...props}
        >
            <div className={cn("flex items-center justify-center w-full transition-opacity duration-200", (isLoading || isPending) ? "opacity-0" : "opacity-100")}>
                {children}
            </div>

            {(isLoading || isPending) && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            )}
        </Button>
    );
}
