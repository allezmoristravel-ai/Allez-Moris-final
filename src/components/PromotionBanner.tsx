"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface PromotionBannerProps {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
}

export default function PromotionBanner({
    title = "Special Promotion",
    description = "Get exclusive deals on your Mauritius vacation!",
    ctaText = "View Promotions",
    ctaLink = "/promotions"
}: PromotionBannerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { i18n } = useTranslation();
    const lang = i18n.language?.split("-")[0] || "en";

    return (
        <>
            {/* Promotion Button */}
            <div className="flex justify-center my-8">
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    {ctaText}
                </Button>
            </div>

            {/* Promotion Modal/Banner */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                        <DialogDescription className="text-base pt-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-6">
                        {/* Promotion Details */}
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-2">
                                Limited time offer - Pre-book now and save!
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    Up to 20% off on selected stays
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    Free airport transfers included
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    Complimentary tour guide service
                                </li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <Link href={ctaLink.startsWith('/') ? ctaLink : `/${lang}/${ctaLink.replace(/^\/+/, '')}`} className="w-full block">
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                                size="lg"
                            >
                                View All Promotions
                            </Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
