"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CancellationPolicyProps {
    /**
     * "compact" = collapsible accordion for the checkout popup
     * "full"    = always-expanded version for the footer / standalone page
     */
    variant?: "compact" | "full";
    className?: string;
}

export default function CancellationPolicy({
    variant = "full",
    className,
}: CancellationPolicyProps) {
    const [isOpen, setIsOpen] = useState(variant === "full");

    const policyContent = (
        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
            {/* 5.1 */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">5.1 Time-Sensitive Refunds</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Cancellations made <strong>48 hours or more</strong> before the scheduled activity may be eligible for a 50% cancellation fee, depending on the supplier&apos;s policy.</li>
                    <li>Cancellations made <strong>within 24 hours</strong> of the activity are generally non-refundable.</li>
                    <li>Bookings cancelled <strong>between 72–48 hours</strong> prior are eligible for a free cancellation, depending on the service provider.</li>
                </ul>
            </div>

            {/* 5.2 */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">5.2 No-Show & Late Arrival Policy</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>If a client does not arrive at the agreed meeting point on time, the service may depart without them.</li>
                    <li>No-shows, missed departures, or late arrivals are non-refundable.</li>
                </ul>
            </div>

            {/* 5.3 */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">5.3 Non-Refundable Items</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>National park or attraction entrance tickets</li>
                    <li>Permits and government fees</li>
                    <li>Special event bookings</li>
                    <li>Custom or private arrangements made specifically for the client</li>
                </ul>
            </div>

            {/* 5.4 */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">5.4 Weather & Operator Cancellations</h4>
                <p className="mb-1">
                    If an activity is cancelled due to bad weather, unsafe sea/road conditions, technical or safety issues, government restrictions, or force majeure, clients may be offered:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>A rescheduled date, OR</li>
                    <li>A refund, subject to the supplier&apos;s policy</li>
                </ul>
                <p className="mt-1.5 text-xs italic">
                    Allez (Moris) Travel Ltd is not liable for additional costs such as flights, accommodation, or personal expenses related to such cancellations.
                </p>
            </div>

            {/* 5.5 */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">5.5 Method of Cancellation</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>In writing via email, OR</li>
                    <li>Through the official communication channel provided at the time of booking</li>
                </ul>
                <p className="mt-1.5 text-xs italic">
                    The cancellation time is calculated based on when the written request is received.
                </p>
            </div>

            {/* 5.6 */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">5.6 Refund Processing</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Processed via the original payment method</li>
                    <li>May take several business days depending on banks and payment providers</li>
                    <li>May be subject to transaction or bank processing fees</li>
                </ul>
            </div>

            {/* 5.7 */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">5.7 Changes Instead of Cancellation</h4>
                <p>
                    Where possible, we will try to accommodate date changes instead of cancellations, subject to availability and supplier approval.
                </p>
            </div>
        </div>
    );

    if (variant === "full") {
        return (
            <div className={cn("", className)}>
                <h3 className="font-semibold text-foreground mb-3">Cancellation & Refund Policy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    At Allez (Moris) Travel Ltd, we work with multiple independent service providers. Cancellation terms may vary depending on the activity, supplier, or special booking conditions. The exact policy will always be confirmed at the time of booking.
                </p>
                {policyContent}
            </div>
        );
    }

    // Compact / collapsible variant (for checkout popup)
    return (
        <div className={cn("border rounded-lg overflow-hidden", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
            >
                <span>Cancellation & Refund Policy</span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 border-t">
                    <p className="text-xs text-muted-foreground mt-3 mb-3">
                        At Allez (Moris) Travel Ltd, we work with multiple independent service providers. Cancellation terms may vary depending on the activity, supplier, or special booking conditions. The exact policy will always be confirmed at the time of booking.
                    </p>
                    {policyContent}
                </div>
            )}
        </div>
    );
}
