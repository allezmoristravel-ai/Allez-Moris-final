"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDays, addYears } from "date-fns";
import { Loader2, Minus, Plus, ChevronLeft, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Activity } from "@/types/strapi";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Schema for Step 1 (Date & Participants)
const step1Schema = z.object({
    date: z.date({
        error: "A date is required.",
    }),
    adults: z.number().min(1).optional(),
    children: z.number().min(0).optional(),
});

// Schema for Step 2 (Contact Details)
const formSchema = step1Schema.extend({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(6, {
        message: "Please enter a valid phone number.",
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
});

interface BookingPopupProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    activity: Activity;
}

export function BookingPopup({ isOpen, onOpenChange, activity }: BookingPopupProps) {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
    const [isPaypalLoading, setIsPaypalLoading] = useState(true);
    const [bookingDocumentId, setBookingDocumentId] = useState<string | null>(null);

    const isGroupPrice = activity.isGroupPrice;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            adults: 1,
            children: 0,
            date: undefined,
            agreeToTerms: false,
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            form.reset({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                adults: 1,
                children: 0,
                date: undefined,
                agreeToTerms: false,
            });
            form.clearErrors();
        }
    }, [isOpen, form]);

    const handleNextStep = async () => {
        const valid = await form.trigger(["date", "adults", "children"]);
        if (valid) {
            setStep(2);
        }
    };

    const handleGoToPayment = async () => {
        const valid = await form.trigger(["firstName", "lastName", "email", "phone", "agreeToTerms"]);
        if (valid) {
            setIsSubmitting(true);
            try {
                // Prepare details for the proxy API
                const firstName = form.getValues("firstName").trim();
                const lastName = form.getValues("lastName").trim();
                const startDateStr = form.getValues("date")?.toISOString() || new Date().toISOString();

                const payload = {
                    client: {
                        firstName,
                        lastName,
                        email: form.getValues("email"),
                        phoneNumber: form.getValues("phone"),
                    },
                    booking: {
                        bookingType: "activity",
                        startDate: startDateStr,
                        participants: (form.getValues("adults") || 0) + (form.getValues("children") || 0),
                        bookingStatus: "pending",
                        totalPrice: calculateTotal(),
                        paymentStatus: "unpaid",
                        activity: activity.documentId,
                    }
                };

                const res = await fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (!res.ok || !data.bookingDocumentId) {
                    throw new Error(data.error || "Failed to create booking in Strapi");
                }

                setBookingDocumentId(data.bookingDocumentId);
                setStep(3);
            } catch (err) {
                console.error("Booking creation error:", err);
                toast.error(t('booking.creationError') || "Failed to initialize booking. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const calculateTotal = useCallback(() => {
        const price = activity.publicPrice || 0;
        const childPrice = activity.childPrice || 0;
        const adults = form.getValues("adults") || 0;
        const children = form.getValues("children") || 0;

        if (isGroupPrice) {
            return price;
        }
        return (adults * price) + (children * childPrice);
    }, [activity.publicPrice, activity.childPrice, isGroupPrice, form]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const adjustCount = (field: "adults" | "children", increment: number) => {
        const currentValue = form.getValues(field) || 0;
        const newValue = Math.max(field === "adults" ? 1 : 0, currentValue + increment);
        form.setValue(field, newValue);
    };

    const SectionHeader = ({ title }: { title: string }) => (
        <div className="mb-2 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-foreground inline-block relative pb-1">
                {title}
                <span className="absolute bottom-0 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h3>
        </div>
    );

    // Min = tomorrow, Max = 1 year from today
    const tomorrow = addDays(new Date(), 1);
    const maxDate = addYears(new Date(), 1);

    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className={`p-0 gap-0 flex flex-col transition-all duration-300 ${step === 3 ? 'w-[95vw] sm:max-w-[750px]' : 'w-[95vw] sm:max-w-[450px]'} max-h-[90svh] overflow-hidden`}
            >
                <DialogHeader className="p-4 border-b bg-muted/20 hidden">
                    <DialogTitle>{activity.title}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col overflow-hidden h-full">

                        <div className="flex-1 p-4 sm:p-6 space-y-8 overflow-y-auto">

                            {step === 1 && (
                                <>
                                    {/* Participants Section */}
                                    <div>
                                        <SectionHeader title={t('booking.participants') || "Participants"} />

                                        {isGroupPrice ? (
                                            <div className="p-4 bg-muted/30 rounded-lg text-muted-foreground text-sm">
                                                {t('booking.groupPriceNote') || "This activity is booked as a single group."}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="adults"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between space-y-0">
                                                            <FormLabel className="text-base font-normal">{t('booking.adults') || "Adults"}</FormLabel>
                                                            <div className="flex items-center gap-3">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                                                                    onClick={() => adjustCount("adults", -1)}
                                                                    disabled={field.value === 1}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="w-4 text-center font-medium">{field.value}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                                                                    onClick={() => adjustCount("adults", 1)}
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="children"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center justify-between space-y-0">
                                                            <FormLabel className="text-base font-normal">{t('booking.children') || "Children"}</FormLabel>
                                                            <div className="flex items-center gap-3">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                                                                    onClick={() => adjustCount("children", -1)}
                                                                    disabled={field.value === 0}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="w-4 text-center font-medium">{field.value}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                                                                    onClick={() => adjustCount("children", 1)}
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Date Section - Inline Calendar */}
                                    <div>
                                        <SectionHeader title={t('booking.chooseDate') || "Choose a date"} />
                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field, fieldState }) => (
                                                <FormItem className="w-full flex flex-col items-center">
                                                    <FormControl>
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            fromDate={tomorrow}
                                                            toDate={maxDate}
                                                            startMonth={tomorrow}
                                                            endMonth={maxDate}
                                                            defaultMonth={tomorrow}
                                                            className={cn("rounded-xl border transition-colors", fieldState.error ? "border-destructive shadow-sm shadow-destructive/20 border-2" : "border-border")}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Booking Summary Section */}
                                    <div>
                                        <SectionHeader title={t('booking.summary') || "Booking Summary"} />
                                        <div className="relative bg-card border rounded-xl overflow-hidden shadow-sm pt-2 sm:pt-4 pb-2 sm:pb-4">
                                            <div className="absolute top-0 bottom-0 left-[66%] border-l-2 border-dashed border-muted z-10"></div>
                                            <div className="absolute -top-3 left-[calc(66%-12px)] w-6 h-6 bg-background rounded-full border border-b-transparent z-20 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)]"></div>
                                            <div className="absolute -bottom-3 left-[calc(66%-12px)] w-6 h-6 bg-background rounded-full border border-t-transparent z-20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"></div>

                                            <div className="flex relative z-0">
                                                <div className="w-2/3 p-3 sm:p-4 flex flex-col justify-between min-h-[100px] sm:min-h-[140px]">
                                                    <div>
                                                        <h4 className="font-bold text-primary text-sm sm:text-lg leading-tight mb-1 sm:mb-2 line-clamp-2">
                                                            {activity.title}
                                                        </h4>
                                                    </div>
                                                    <div className="text-sm text-foreground/80 mt-auto">
                                                        {isGroupPrice ? (
                                                            <span>{t('booking.groupBooking')} (1)</span>
                                                        ) : (
                                                            <span>
                                                                {t('booking.adults')}: {form.watch('adults') || 0}
                                                                <br />
                                                                {form.watch('children') ? `${t('booking.children')}: ${form.watch('children')}` : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-1/3 p-4 bg-muted/10 flex flex-col items-end justify-end">
                                                    <div className="text-xs text-muted-foreground mb-1">{t('booking.total')}:</div>
                                                    <div className="font-bold text-xl text-primary">
                                                        {formatCurrency(calculateTotal())}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="mb-4 flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="-ml-2 h-8 w-8 text-muted-foreground mr-1"
                                            onClick={() => setStep(1)}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            <span className="sr-only">{t('booking.back') || "Back"}</span>
                                        </Button>
                                        <h3 className="text-lg font-bold">{t('booking.contactDetails') || "Contact Details"}</h3>
                                    </div>
                                    <Separator className="mb-6" />

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('booking.firstName') || "First Name"}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="John" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('booking.lastName') || "Last Name"}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Doe" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('booking.email') || "Email"}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="john@example.com" type="email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('booking.phone') || "Phone Number"}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+1 234 567 890" type="tel" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="agreeToTerms"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm mt-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-normal cursor-pointer text-muted-foreground">
                                                            {t('booking.agreeToTerms') || "I have read and agree to the"}{" "}
                                                            <a
                                                                href={`/${i18n.language?.split('-')[0] || 'en'}/terms-and-conditions`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="underline text-primary hover:text-primary/80 transition-colors font-medium"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {t('booking.termsAndConditions') || "Terms & Conditions"}
                                                            </a>
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="mb-4 flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="-ml-2 h-8 w-8 text-muted-foreground mr-1"
                                            onClick={() => setStep(2)}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            <span className="sr-only">{t('booking.back') || "Back"}</span>
                                        </Button>
                                        <h3 className="text-lg font-bold">{t('booking.payment') || "Payment"}</h3>
                                    </div>
                                    <Separator className="mb-6" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Left column – Order recap */}
                                        <div className="space-y-4">
                                            <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                                <h4 className="font-semibold text-sm text-foreground">{t('booking.summary') || "Booking Summary"}</h4>
                                                <Separator />
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">{t('booking.activity') || "Activity"}</span>
                                                        <span className="font-medium text-foreground text-right max-w-[60%]">{activity.title}</span>
                                                    </div>
                                                    {!isGroupPrice && (
                                                        <>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">{t('booking.adults') || "Adults"}</span>
                                                                <span className="font-medium">{form.getValues('adults') || 1}</span>
                                                            </div>
                                                            {(form.getValues('children') || 0) > 0 && (
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">{t('booking.children') || "Children"}</span>
                                                                    <span className="font-medium">{form.getValues('children')}</span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                    {form.getValues('date') && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">{t('booking.date') || "Date"}</span>
                                                            <span className="font-medium">{form.getValues('date')?.toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-semibold">{t('booking.total')}</span>
                                                    <span className="font-bold text-xl text-primary">{formatCurrency(calculateTotal())}</span>
                                                </div>
                                            </div>

                                            <div className="bg-muted/10 rounded-lg p-3 sm:p-4 text-xs sm:text-sm space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">{t('booking.fullName') || "Name"}</span>
                                                    <span className="font-medium text-right ml-2 line-clamp-1">{form.getValues('firstName')} {form.getValues('lastName')}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">{t('booking.email') || "Email"}</span>
                                                    <span className="font-medium text-right ml-2 line-clamp-1">{form.getValues('email')}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                                <ShieldCheck className="h-4 w-4" />
                                                <span>{t('booking.securePayment') || "Secure Payment"}</span>
                                            </div>
                                        </div>

                                        {/* Right column – PayPal Buttons */}
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground text-center">
                                                {t('booking.paymentDescription') || "Complete your payment securely via PayPal."}
                                            </p>

                                            {paypalClientId ? (
                                                <PayPalScriptProvider
                                                    options={{
                                                        clientId: paypalClientId,
                                                        currency: "EUR",
                                                        intent: "capture",
                                                        locale: i18n.language === 'fr' ? 'fr_FR' : 'en_US',
                                                    }}
                                                >
                                                    {isPaypalLoading && (
                                                        <div className="flex flex-col items-center justify-center py-8 space-y-4 rounded-xl border border-dashed border-border bg-muted/10">
                                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                            <p className="text-sm font-medium text-muted-foreground animate-pulse">
                                                                {t('booking.loadingPayment') || "Loading secure payment..."}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className={cn("transition-opacity duration-300", isPaypalLoading ? "opacity-0 absolute pointer-events-none" : "opacity-100 relative")}>
                                                        <PayPalButtons
                                                            style={{
                                                                layout: "vertical",
                                                                color: "gold",
                                                                shape: "rect",
                                                                label: "paypal",
                                                                tagline: false,
                                                            }}
                                                            disabled={isSubmitting}
                                                            onInit={() => {
                                                                setIsPaypalLoading(false);
                                                            }}
                                                            createOrder={async () => {
                                                                const total = calculateTotal();
                                                                const res = await fetch("/api/paypal/create-order", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({
                                                                        amount: total,
                                                                        currency: "EUR",
                                                                        description: activity.title,
                                                                    }),
                                                                });
                                                                const data = await res.json();
                                                                if (!res.ok) {
                                                                    throw new Error(data.error || "Failed to create order");
                                                                }

                                                                // Update booking with PayPal Order ID
                                                                if (bookingDocumentId) {
                                                                    await fetch("/api/bookings", {
                                                                        method: "PUT",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({
                                                                            bookingDocumentId,
                                                                            updateData: {
                                                                                paypalOrderId: data.id,
                                                                                paymentStatus: "paypal_processing"
                                                                            }
                                                                        })
                                                                    }).catch(e => console.error("Failed to update booking status before approval", e));
                                                                }

                                                                return data.id;
                                                            }}
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            onApprove={async (data: Record<string, any>) => {
                                                                setIsSubmitting(true);
                                                                try {
                                                                    const res = await fetch("/api/paypal/capture-order", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ 
                                                                            orderID: data.orderID,
                                                                            bookingDetails: {
                                                                                title: activity.title,
                                                                                firstName: form.getValues('firstName'),
                                                                                lastName: form.getValues('lastName'),
                                                                                email: form.getValues('email'),
                                                                                phone: form.getValues('phone'),
                                                                                date: form.getValues('date')?.toISOString(),
                                                                                adults: form.getValues('adults'),
                                                                                children: form.getValues('children')
                                                                            }
                                                                        }),
                                                                    });
                                                                    const captureData = await res.json();

                                                                    if (!res.ok) {
                                                                        throw new Error(captureData.error || "Capture failed");
                                                                    }

                                                                    // Extract capture ID (PayPal v2 usually puts it in purchase_units[0].payments.captures[0].id)
                                                                    let captureId = data.orderID;
                                                                    try {
                                                                        if (captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id) {
                                                                            captureId = captureData.purchase_units[0].payments.captures[0].id;
                                                                        } else if (captureData.id) {
                                                                            captureId = captureData.id;
                                                                        }
                                                                    } catch { /* ignore */ }

                                                                    // Update booking as confirmed
                                                                    if (bookingDocumentId) {
                                                                        await fetch("/api/bookings", {
                                                                            method: "PUT",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({
                                                                                bookingDocumentId,
                                                                                updateData: {
                                                                                    paypalCaptureId: captureId,
                                                                                    paymentStatus: "paid",
                                                                                    bookingStatus: "confirmed"
                                                                                }
                                                                            })
                                                                        }).catch(e => console.error("Failed to confirm booking", e));
                                                                    }

                                                                    const formValues = form.getValues();
                                                                    console.log("Booking Confirmed:", {
                                                                        paypalOrderId: data.orderID,
                                                                        activityId: activity.id,
                                                                        activityTitle: activity.title,
                                                                        total: calculateTotal(),
                                                                        ...formValues,
                                                                    });

                                                                    setPaypalOrderId(data.orderID ?? null);
                                                                    setStep(4);
                                                                } catch (err) {
                                                                    console.error("PayPal capture error:", err);
                                                                    toast.error(
                                                                        t('booking.paymentError') || "Payment failed. Please try again."
                                                                    );
                                                                } finally {
                                                                    setIsSubmitting(false);
                                                                }
                                                            }}
                                                            onError={() => {
                                                                toast.error(
                                                                    t('booking.paymentError') || "Payment failed. Please try again."
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </PayPalScriptProvider>
                                            ) : (
                                                <div className="text-center text-sm text-destructive p-4 border border-destructive/30 rounded-lg">
                                                    PayPal is not configured. Please set <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in your environment.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cancellation Policy Link - Moved to step 2 as required checkbox */}
                                </>
                            )}

                            {step === 4 && (
                                <div className="flex flex-col items-center justify-center text-center py-6 space-y-5">
                                    {/* Animated green checkmark */}
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '1.5s', animationIterationCount: 2 }} />
                                        <div className="relative bg-green-500/10 rounded-full p-4">
                                            <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-foreground">
                                            {t('booking.paymentSuccess') || "Payment successful!"}
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            {t('booking.confirmationMessage') || "Your booking is confirmed. You will receive a confirmation email shortly."}
                                        </p>
                                    </div>

                                    {/* Booking summary card */}
                                    <div className="w-full bg-muted/20 rounded-lg p-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('booking.activity') || "Activity"}</span>
                                            <span className="font-medium text-right">{activity.title}</span>
                                        </div>
                                        {form.getValues('date') && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">{t('booking.date') || "Date"}</span>
                                                <span className="font-medium">{form.getValues('date')?.toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                            <span>{t('booking.total')}</span>
                                            <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                                        </div>
                                    </div>

                                    {paypalOrderId && (
                                        <p className="text-xs text-muted-foreground">
                                            {t('booking.referenceNumber') || "Reference"}: <span className="font-mono">{paypalOrderId}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer / Actions - Fixed at bottom */}
                        <div className="p-4 sm:p-6 border-t bg-background mt-auto flex-shrink-0 rounded-b-lg z-10 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
                            {step === 1 ? (
                                <Button
                                    type="button"
                                    className="w-full text-lg h-12"
                                    onClick={handleNextStep}
                                >
                                    {t('booking.checkout') || "Checkout"} <Lock className="w-4 h-4 ml-2 opacity-70" />
                                </Button>
                            ) : step === 2 ? (
                                <Button
                                    type="button"
                                    className="w-full text-lg h-12"
                                    onClick={handleGoToPayment}
                                >
                                    {t('booking.securePayment') || "Secure Payment"} <ShieldCheck className="w-4 h-4 ml-2 opacity-70" />
                                </Button>
                            ) : step === 3 ? (
                                /* Step 3 - footer shows a subtle back link only; PayPal buttons are in the body */
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-muted-foreground"
                                    onClick={() => setStep(2)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    {t('booking.back') || "Back"}
                                </Button>
                            ) : (
                                /* Step 4 - Close button */
                                <Button
                                    type="button"
                                    className="w-full text-lg h-12"
                                    onClick={() => {
                                        onOpenChange(false);
                                        setStep(1);
                                        setPaypalOrderId(null);
                                        setBookingDocumentId(null);
                                        form.reset();
                                    }}
                                >
                                    {t('booking.close') || "Close"}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}