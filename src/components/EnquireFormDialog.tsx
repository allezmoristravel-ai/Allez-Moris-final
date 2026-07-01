"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Loader2, Send, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface EnquireFormDialogProps {
    itemName: string;
    type: "accommodation" | "rental" | "activity" | "transfer";
    trigger: React.ReactNode;
}

export default function EnquireFormDialog({ itemName, type, trigger }: EnquireFormDialogProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [adults, setAdults] = useState("2");
    const [children, setChildren] = useState("0");
    const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), 1));
    const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 3));
    const [message, setMessage] = useState("");
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);

    const hasEndDate = type === "accommodation" || type === "rental";

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setPhone("");
        setAdults("2");
        setChildren("0");
        setStartDate(addDays(new Date(), 1));
        setEndDate(addDays(new Date(), 3));
        setMessage("");
        setIsSuccess(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/enquire", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: fullName,
                    email,
                    phone,
                    adults: parseInt(adults),
                    children: parseInt(children),
                    start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
                    ...(hasEndDate ? { end_date: endDate ? format(endDate, "yyyy-MM-dd") : "" } : {}),
                    message,
                    itemName,
                    type,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Something went wrong");
            }

            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-lg max-h-[90dvh] overflow-y-auto p-6 sm:p-8 rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-serif">
                        {type === "activity"
                            ? t("enquireForm.prebookTitle", { fallback: "Pre-book" })
                            : t("enquireForm.title", { fallback: "Enquire Now" })}
                    </DialogTitle>
                    <DialogDescription>
                        {itemName}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-8 text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                        <h3 className="text-xl font-semibold">
                            {type === "activity"
                                ? t("enquireForm.prebookSuccess", { fallback: "Pre-booking Received!" })
                                : t("enquireForm.success", { fallback: "Enquiry Sent!" })}
                        </h3>
                        <p className="text-muted-foreground">
                            {type === "activity"
                                ? t("enquireForm.prebookSuccessDesc", { fallback: "Your spot is reserved. We'll send you payment details within 24 hours to confirm it." })
                                : t("enquireForm.successDesc", { fallback: "We'll get back to you within 24 hours." })}
                        </p>
                        <Button onClick={() => setOpen(false)}>
                            {t("enquireForm.close", { fallback: "Close" })}
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-4 sm:pb-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="enquire-name">
                                    {t("enquireForm.name", { fallback: "Full Name" })} *
                                </Label>
                                <Input
                                    id="enquire-name"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="enquire-email">
                                    {t("enquireForm.email", { fallback: "Email" })} *
                                </Label>
                                <Input
                                    id="enquire-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="enquire-phone">
                                {t("enquireForm.phone", { fallback: "Phone" })} *
                            </Label>
                            <Input
                                id="enquire-phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+230 1234 5678"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="enquire-adults">
                                    {t("enquireForm.adults", { fallback: "Adults" })}
                                </Label>
                                <Input
                                    id="enquire-adults"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={adults}
                                    onChange={(e) => setAdults(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="enquire-children">
                                    {t("enquireForm.children", { fallback: "Children" })}
                                </Label>
                                <Input
                                    id="enquire-children"
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={children}
                                    onChange={(e) => setChildren(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className={cn("space-y-2", type === "activity" && "sm:col-span-2")}>
                                <Label>
                                    {type === "rental" 
                                        ? t("enquireForm.pickUp", { fallback: "Pick-up Date" })
                                        : type === "activity" 
                                        ? t("enquireForm.preferredDate", { fallback: "Preferred Date" })
                                        : type === "transfer"
                                        ? t("enquireForm.transferDate", { fallback: "Transfer Date" })
                                        : t("enquireForm.checkIn", { fallback: "Check-in" })}
                                </Label>
                                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-card" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date);
                                                if (endDate && date && endDate < date) {
                                                    setEndDate(addDays(date, 2));
                                                }
                                                setIsStartDateOpen(false);
                                            }}
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            autoFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {hasEndDate && (
                                <div className="space-y-2">
                                    <Label>
                                        {type === "rental"
                                            ? t("enquireForm.dropOff", { fallback: "Drop-off Date" })
                                            : t("enquireForm.checkOut", { fallback: "Check-out" })}
                                    </Label>
                                    <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-card" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={(date) => {
                                                    setEndDate(date);
                                                    setIsEndDateOpen(false);
                                                }}
                                                disabled={(date) => date < (startDate || new Date(new Date().setHours(0, 0, 0, 0)))}
                                                autoFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="enquire-message">
                                {t("enquireForm.message", { fallback: "Message" })}
                            </Label>
                            <Textarea
                                id="enquire-message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={
                                    type === "transfer"
                                        ? t("enquireForm.messagePlaceholderTransfer", { fallback: "Please include your flight details (flight number, arrival/departure time)..." })
                                        : t("enquireForm.messagePlaceholder", { fallback: "Any special requests or questions..." })
                                }
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <div className="pt-2">
                            <Button type="submit" className="w-full h-12 text-base font-medium rounded-xl" disabled={isLoading}>
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                                ) : (
                                    <><Send className="mr-2 h-5 w-5" /> {type === "activity"
                                        ? t("enquireForm.prebookSubmit", { fallback: "Confirm Pre-booking" })
                                        : t("enquireForm.submit", { fallback: "Send Enquiry" })}</>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
