"use client";

import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    value?: number | null;
    className?: string;
    starClassName?: string;
}

/** Hotel-style star rating. Renders nothing for missing or zero values. */
export default function StarRating({ value, className, starClassName = "w-4 h-4" }: StarRatingProps) {
    const { t } = useTranslation();
    if (value == null) return null;
    const stars = Math.min(5, Math.max(0, Math.round(value)));
    if (stars === 0) return null;

    return (
        <div role="img" aria-label={t("services.starRating", { stars })} className={cn("flex gap-0.5", className)}>
            {[...Array(stars)].map((_, i) => (
                <Star key={i} aria-hidden="true" className={cn("fill-primary text-primary", starClassName)} />
            ))}
        </div>
    );
}
