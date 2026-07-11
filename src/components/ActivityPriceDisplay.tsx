import { Activity } from "@/types/strapi";

interface ActivityPriceDisplayProps {
    activity: Activity;
    labels: {
        perAdult: string;
        perChild: string;
    };
    variant?: "card" | "details";
}

export const ActivityPriceDisplay = ({ activity, labels, variant = "card" }: ActivityPriceDisplayProps) => {
    const priceSize = variant === "details" ? "text-3xl" : "text-2xl";
    const childPriceSize = variant === "details" ? "text-xl" : "text-lg";

    if (activity.isGroupPrice) {
        return (
            <span className={`${priceSize} font-bold text-foreground`}>
                €{activity.adultPrice}
            </span>
        );
    }

    const hasChildPrice = typeof activity.childPrice === "number" && activity.childPrice > 0;

    return (
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className={`${priceSize} font-bold text-foreground`}>
                €{activity.adultPrice}
                <span className="text-muted-foreground text-sm font-normal"> {labels.perAdult}</span>
            </span>
            {hasChildPrice && (
                <span className={`${childPriceSize} font-bold text-foreground`}>
                    €{activity.childPrice}
                    <span className="text-muted-foreground text-sm font-normal"> {labels.perChild}</span>
                </span>
            )}
        </div>
    );
};
