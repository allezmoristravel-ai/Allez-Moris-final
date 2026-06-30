import { Badge } from "@/components/ui/badge";
import { NavigationButton } from "@/components/NavigationButton";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { Activity } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/api";

interface ActivityCardProps {
    activity: Activity;
    showCategoryBadge?: boolean;
    labels: {
        viewDetails: string;
        perPerson: string;
    };
    lang: string;
    regionTranslation?: string;
}

export const ActivityCard = ({ activity, showCategoryBadge = true, labels, lang, regionTranslation }: ActivityCardProps) => {
    const imageUrl = getStrapiMedia(activity.coverImage?.[0]?.url) || "/category-sea.jpg"; // Fallback image
    const categoryName = activity.category?.name || 'Tour';
    const price = activity.publicPrice;

    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
            {/* Image */}
            <div className="relative h-52 shrink-0">
                <img
                    src={imageUrl}
                    alt={activity.coverImage?.[0]?.alternativeText || activity.title}
                    className="w-full h-full object-cover"
                />
                {activity.highlights && ( // Assuming highlights is a string/rich text, checking if truthy. 
                    // If it was a boolean or specific field like 'isRecommended', we'd use that.
                    // For now, Strapi type has highlights as string (rich text). 
                    // The old code checked for 'highlight' string property. 
                    // We might not have a direct 'highlight' badge equivalent in the Strapi model provided.
                    // I will skip the "Recommended" badge for now unless I find a matching field or use a default.
                    // Wait, existing code used `activity.highlight`. Strapi model has `highlights` (plural, rich text).
                    // I'll omit the badge for now to avoid showing raw HTML or long text.
                    null
                )}
                {showCategoryBadge && (
                    <Badge
                        className="absolute top-4 right-4 capitalize bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                    >
                        {categoryName}
                    </Badge>
                )}
                {activity.region && (
                    <Badge
                        variant="secondary"
                        className="absolute top-4 left-4 capitalize flex items-center gap-1 shadow-md bg-background/90 backdrop-blur-sm text-foreground hover:bg-background"
                    >
                        <MapPin className="w-3 h-3" />
                        {regionTranslation || activity.region}
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
                    {activity.title}
                </h3>

                {/* Rating - Mocked for now as not in Strapi Type */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-semibold text-foreground">
                            5.0
                        </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                        (Recommended)
                    </span>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="truncate max-w-[80px]">{activity.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="truncate max-w-[80px]">{activity.maxPersons ? `Up to ${activity.maxPersons}` : 'Group'}</span>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-foreground">
                            €{price}
                        </span>
                        <span className="text-muted-foreground text-sm">
                            {" "}
                            {!activity.isGroupPrice && labels.perPerson}
                        </span>
                    </div>
                    <NavigationButton href={`/${lang}/activity/${activity.slug}`} variant="default" size="sm">
                        {labels.viewDetails}
                    </NavigationButton>
                </div>
            </div>
        </div>
    );
};
