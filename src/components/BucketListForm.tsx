"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { sendBucketListEmail } from "@/lib/resend";
import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES, ACTIVITY_CATEGORIES } from "@/data/formOptions";

const BucketListForm = () => {
    const { toast } = useToast();
    const { t } = useTranslation();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        people: "2",
        country: "",
        firstTime: "",
        reason: [] as string[],
        experience: [] as string[],
        activities: {} as Record<string, string[]>,
        notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Date States
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helpers
    const toggleSelection = (field: 'reason' | 'experience', value: string) => {
        setFormData(prev => {
            const current = prev[field];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const toggleActivity = (categoryKey: string, activityId: string) => {
        setFormData(prev => {
            const currentCategoryItems = prev.activities[categoryKey] || [];
            const updatedCategoryItems = currentCategoryItems.includes(activityId)
                ? currentCategoryItems.filter(id => id !== activityId)
                : [...currentCategoryItems, activityId];

            return {
                ...prev,
                activities: {
                    ...prev.activities,
                    [categoryKey]: updatedCategoryItems
                }
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await sendBucketListEmail({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                country: formData.country,
                people: parseInt(formData.people) || 1,
                firstTime: formData.firstTime === 'yes',
                reason: formData.reason,
                experience: formData.experience,
                activities: formData.activities,
                startDate,
                endDate,
                notes: formData.notes,
            });

            if (result.success) {
                toast({
                    title: t("bucketList.form.success"),
                    description: t("bucketList.form.successDesc"),
                });
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    people: "2",
                    country: "",
                    firstTime: "",
                    reason: [],
                    experience: [],
                    activities: {},
                    notes: "",
                });
                setStartDate(undefined);
                setEndDate(undefined);
            } else {
                toast({
                    title: "Error",
                    description: result.error ? String(result.error) : t("bucketList.form.error"),
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: t("bucketList.form.error"),
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="bucket-list" className="py-16 md:py-24 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-background/40 backdrop-blur-md rounded-full px-4 py-2 mb-4">
                            <Sparkles className="w-5 h-5 text-ocean" />
                            <span className="font-medium text-ocean">{t("bucketList.badge")}</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {t("bucketList.title")}
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            {t("bucketList.description")}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-background/40 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-lg border border-border/50 space-y-10">

                        {/* Guest Details */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground/80 border-b pb-2">{t("bucketList.form.guestDetails")}</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name" className="mb-2 block">{t("bucketList.form.name")}</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        className="h-12"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="mb-2 block">{t("bucketList.form.email")}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="h-12"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="mb-2 block">{t("bucketList.form.phone")} *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        className="h-12"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="people" className="mb-2 block">{t("bucketList.form.people")} *</Label>
                                    <Input
                                        id="people"
                                        type="number"
                                        min="1"
                                        className="h-12"
                                        value={formData.people}
                                        onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="country" className="mb-2 block">{t("bucketList.form.country")} *</Label>
                                    <Select
                                        value={formData.country || undefined}
                                        onValueChange={(val) => setFormData({ ...formData, country: val })}
                                    >
                                        <SelectTrigger className="h-12">
                                            <SelectValue placeholder={t("bucketList.form.selectCountry")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COUNTRIES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground/80 border-b pb-2">{t("bucketList.form.arrival")} & {t("bucketList.form.departure")}</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">{t("bucketList.form.arrival")}</Label>
                                    <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal h-12"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : t("bucketList.form.selectDate")}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-card" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={(date) => {
                                                    setStartDate(date);
                                                    if (endDate && date && endDate < date) {
                                                        setEndDate(undefined);
                                                    }
                                                    setIsStartOpen(false);
                                                }}
                                                disabled={(date) => date < today}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label className="mb-2 block">{t("bucketList.form.departure")}</Label>
                                    <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal h-12"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : t("bucketList.form.selectDate")}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-card" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={(date) => {
                                                    setEndDate(date);
                                                    setIsEndOpen(false);
                                                }}
                                                disabled={(date) => date < (startDate || today)}
                                                initialFocus
                                                onDayMouseEnter={setHoveredDate}
                                                onDayMouseLeave={() => setHoveredDate(null)}
                                                modifiers={{
                                                    range_middle: (date) =>
                                                        !!(startDate && hoveredDate && date > startDate && date < hoveredDate),
                                                }}
                                                modifiersClassNames={{
                                                    range_middle: "bg-accent text-accent-foreground rounded-none",
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        {/* Visit Preferences */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground/80 border-b pb-2">{t("bucketList.form.visitPreferences")}</h3>

                            <div className="mb-6">
                                <Label className="mb-3 block text-base">{t("bucketList.form.firstTime")}</Label>
                                <RadioGroup
                                    value={formData.firstTime}
                                    onValueChange={(val) => setFormData({ ...formData, firstTime: val })}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="first-yes" />
                                        <Label htmlFor="first-yes" className="font-normal cursor-pointer">{t("bucketList.form.yes")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="first-no" />
                                        <Label htmlFor="first-no" className="font-normal cursor-pointer">{t("bucketList.form.no")}</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="mb-6">
                                <Label className="mb-3 block text-base">{t("bucketList.form.reason")}</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Holiday', 'Honeymoon', 'Family Trip', 'Adventure', 'Other'].map((item) => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`reason-${item}`}
                                                checked={formData.reason.includes(item)}
                                                onCheckedChange={() => toggleSelection('reason', item)}
                                            />
                                            <Label htmlFor={`reason-${item}`} className="font-normal cursor-pointer">{t(`bucketList.form.reasons.${item}`)}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <Label className="mb-3 block text-base">{t("bucketList.form.experience")}</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Adventure', 'Local Experiences', 'Relaxation', 'Mix of All'].map((item) => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`exp-${item}`}
                                                checked={formData.experience.includes(item)}
                                                onCheckedChange={() => toggleSelection('experience', item)}
                                            />
                                            <Label htmlFor={`exp-${item}`} className="font-normal cursor-pointer">{t(`bucketList.form.experiences.${item}`)}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Activity Itinerary */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6 text-foreground/80 border-b pb-2">{t("bucketList.form.activityItinerary")}</h3>
                            <div className="grid gap-8">
                                {ACTIVITY_CATEGORIES.map((category) => (
                                    <div key={category.id} className="bg-card/50 p-6 rounded-xl border border-border/50">
                                        <h4 className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary">
                                            <span className="text-2xl">{category.icon}</span>
                                            {t(`bucketList.form.interestLabels.${category.titleKey}`) !== `bucketList.form.interestLabels.${category.titleKey}`
                                                ? t(`bucketList.form.interestLabels.${category.titleKey}`)
                                                : category.titleKey}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {category.items.map((item) => {
                                                const translatedLabel = t(`bucketList.form.interestLabels.${item.labelKey}`);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${formData.activities[category.id]?.includes(item.id)
                                                            ? 'bg-primary/5 border-primary'
                                                            : 'bg-background hover:bg-muted/50 border-input'
                                                            }`}
                                                    // onClick handler removed to prevent double-toggling with Checkbox/Label
                                                    >
                                                        <Checkbox
                                                            id={`${category.id}-${item.id}`}
                                                            checked={formData.activities[category.id]?.includes(item.id)}
                                                            onCheckedChange={() => toggleActivity(category.id, item.id)}
                                                        />
                                                        <Label
                                                            htmlFor={`${category.id}-${item.id}`}
                                                            className="font-normal cursor-pointer flex-1"
                                                        >
                                                            {translatedLabel !== `bucketList.form.interestLabels.${item.labelKey}` ? translatedLabel : item.labelKey}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground/80 border-b pb-2">{t("bucketList.form.additionalNotes")}</h3>
                            <Label htmlFor="notes" className="mb-2 block">{t("bucketList.form.notesLabel")}</Label>
                            <Textarea
                                id="notes"
                                placeholder={t("bucketList.form.notesPlaceholder")}
                                className="min-h-[120px]"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-lg mt-8"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {t("bucketList.form.sending")}
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    {t("bucketList.form.submit")}
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BucketListForm;
