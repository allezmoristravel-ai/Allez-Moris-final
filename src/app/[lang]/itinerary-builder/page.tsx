"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  formSchema,
  generateItinerary,
  ItineraryAPIResponse,
  ItineraryFormInput,
} from "@/lib/itineraryApi";
import { Loader2, Download, CalendarIcon, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

export default function ItineraryBuilderPage() {
  const [itineraryResponse, setItineraryResponse] = useState<ItineraryAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const params = useParams();
  const lang = params.lang as string;
  const [currentStep, setCurrentStep] = useState(0);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const fieldNamesForStep = [
    ['user_context.name', 'trip_details.start_date', 'trip_details.end_date'], // Step 0
    ['trip_details.destination', 'trip_details.adults'], // Step 1
    ['user_context.travel_style', 'user_context.budget_level'], // Step 2
    ['preferences.interests', 'preferences.rhythm'], // Step 3
  ];

  const handleNext = async () => {
    const currentStepFields = fieldNamesForStep[currentStep];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await form.trigger(currentStepFields as any, { shouldFocus: true });

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const form = useForm<ItineraryFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_context: {
        name: "",
        travel_style: "balanced",
        budget_level: "mid_range",
        language: lang,
      },
      trip_details: {
        destination: [],
        start_date: new Date(),
        end_date: addDays(new Date(), 2),
        adults: 2,
        children: [],
      },
      logistics: {
        transport_preference: "any",
        accommodation_type: "any",
        flight_booked: false,
      },
      preferences: {
        interests: ["beach_lagoon"],
        rhythm: "balanced",
      },
      metadata: {
        source: "tour_operator_demo",
        thread_id: undefined,
      }
    },
  });

  async function onSubmit(values: ItineraryFormInput) {
    setIsLoading(true);
    setError(null);
    setItineraryResponse(null);
    try {
      const response = await generateItinerary(values);
      setItineraryResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownloadPdf = () => {
    if (!itineraryResponse?.pdf_content) return;

    try {
      const byteCharacters = atob(itineraryResponse.pdf_content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${itineraryResponse.itinerary.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error downloading PDF:", e);
    }
  };

  const steps = [
    // Step 1: User Info & Dates
    <div key={0} className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">{t('itineraryBuilder.sections.userContext')}</h2>
      <FormField
        control={form.control}
        name="user_context.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('itineraryBuilder.form.name')}</FormLabel>
            <FormControl>
              <Input placeholder={t('itineraryBuilder.form.namePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="trip_details.start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('itineraryBuilder.form.startDate')}</FormLabel>
              <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : t('itineraryBuilder.form.pickADate')}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      const endDate = form.getValues("trip_details.end_date");
                      if (endDate && date && endDate < date) {
                        form.setValue("trip_details.end_date", addDays(date, 2));
                      }
                      setIsStartDateOpen(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trip_details.end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('itineraryBuilder.form.endDate')}</FormLabel>
              <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : t('itineraryBuilder.form.pickADate')}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsEndDateOpen(false);
                    }}
                    disabled={(date) => date < (form.getValues("trip_details.start_date") || new Date(new Date().setHours(0, 0, 0, 0)))}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>,

    // Step 2: Adults & Children & Destination
    <div key={1} className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">{t('itineraryBuilder.sections.tripDetails')}</h2>
      <FormField
        control={form.control}
        name="trip_details.destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('itineraryBuilder.form.region')}</FormLabel>
            <FormDescription>
              {t('itineraryBuilder.form.selectRegions')}
            </FormDescription>
            <FormControl>
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 md:grid-cols-4 gap-2"
              >
                {['North', 'East', 'South', 'West'].map((region) => (
                  <ToggleGroupItem key={region} value={region} className="p-4 h-auto flex-col">
                    <span>{t(`itineraryBuilder.regions.${region}`)}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="trip_details.adults"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('itineraryBuilder.form.adults')}</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Children ages - dynamic list */}
      <div className="space-y-4">
        <FormLabel>{t('itineraryBuilder.form.childrenAges')}</FormLabel>
        <FormDescription>{t('itineraryBuilder.form.childrenAgesDescription')}</FormDescription>

        {(form.watch("trip_details.children") || []).map((_, index) => (
          <FormField
            key={index}
            control={form.control}
            name={`trip_details.children.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="17"
                      placeholder={t('itineraryBuilder.form.childAgePlaceholder')}
                      {...field}
                      onChange={event => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const current = form.getValues("trip_details.children");
                      form.setValue("trip_details.children", current.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const current = form.getValues("trip_details.children") || [];
            form.setValue("trip_details.children", [...current, 0]);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('itineraryBuilder.form.addChild')}
        </Button>
      </div>
    </div>,

    // Step 3: Budget & Travel Style
    <div key={2} className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">{t('itineraryBuilder.sections.userContext')}</h2>
      <FormField
        control={form.control}
        name="user_context.travel_style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('itineraryBuilder.form.travelStyle')}</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                <ToggleGroupItem value="adventure" className="p-4 h-auto flex-col">
                  {/* Icon or Image goes here if desired */}
                  <span>{t('itineraryBuilder.travelStyles.adventure')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="relaxation" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.travelStyles.relaxation')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="cultural" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.travelStyles.cultural')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="family" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.travelStyles.family')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="romantic" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.travelStyles.romantic')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="luxury" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.travelStyles.luxury')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="budget" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.travelStyles.budget')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="balanced" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.travelStyles.balanced')}</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="user_context.budget_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('itineraryBuilder.form.budgetLevel')}</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                <ToggleGroupItem value="luxury" className="p-4 h-auto flex-col">
                  {/* Icon or Image goes here if desired */}
                  <span>{t('itineraryBuilder.budgetLevels.luxury')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="mid_range" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.budgetLevels.midRange')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="budget" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.budgetLevels.budget')}</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>,

    // Step 4: Interests & Rhythm
    <div key={3} className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">{t('itineraryBuilder.sections.preferences')}</h2>
      <FormField
        control={form.control}
        name="preferences.interests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('itineraryBuilder.form.interests')}</FormLabel>
            <FormDescription>
              {t('itineraryBuilder.form.selectInterests')}
            </FormDescription>
            <FormControl>
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                <ToggleGroupItem value="beach_lagoon" className="p-4 h-auto flex-col">
                  {/* <Image src="/icons/beach.svg" alt="Beach" width={24} height={24} className="mb-1" /> */}
                  <span>{t('itineraryBuilder.interestsCategories.beach_lagoon')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="nature_wildlife" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.interestsCategories.nature_wildlife')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="culture_history" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.interestsCategories.culture_history')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="gastronomy" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.interestsCategories.gastronomy')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="water_sports" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.interestsCategories.water_sports')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="wellness_spa" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.interestsCategories.wellness_spa')}</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="preferences.rhythm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('itineraryBuilder.form.rhythm')}</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                <ToggleGroupItem value="relaxed" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.rhythms.relaxed')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="balanced" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.rhythms.balanced')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="fast_paced" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.rhythms.fastPaced')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="adventure" className="p-4 h-auto flex-col">
                  <span>{t('itineraryBuilder.rhythms.adventure')}</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>,


  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-4">{t('itineraryBuilder.title')}</h1>
      <p className="text-center text-lg text-muted-foreground mb-8">{t('itineraryBuilder.description')}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {steps[currentStep]}

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                {t('itineraryBuilder.common.previous')}
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={handleNext}>
                {t('itineraryBuilder.common.next')}
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('itineraryBuilder.form.submit')}
              </Button>
            )}
          </div>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-lg">{t('itineraryBuilder.messages.generatingItinerary')}</p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-center text-red-500">
          <p className="text-lg">{t('itineraryBuilder.messages.errorOccurred')}</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {itineraryResponse && (
        <div className="mt-8 p-6 bg-card rounded-lg shadow-lg">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">{itineraryResponse.itinerary.title}</h2>
            {itineraryResponse.pdf_content && (
              <Button onClick={handleDownloadPdf} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                {t('itineraryBuilder.common.downloadPdf') || "Download PDF"}
              </Button>
            )}
          </div>
          <p className="text-muted-foreground mb-6">{itineraryResponse.itinerary.summary}</p>
          <h3 className="text-2xl font-semibold mb-4">{t('itineraryBuilder.itineraryDisplay.yourPlan')}</h3>
          {itineraryResponse.itinerary.days.map((dayPlan, index) => (
            <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
              <h4 className="text-xl font-medium mb-2">{t('itineraryBuilder.itineraryDisplay.day')} {dayPlan.day}: {dayPlan.area}</h4>
              <ul className="list-disc pl-5">
                {dayPlan.activities.map((activity, activityIndex) => (
                  <li key={activityIndex} className="mb-4">
                    {/* Activity Title and Duration */}
                    <div className="flex justify-between items-center mb-2">
                      {(activity.title || activity.activity_ref_name) && (
                        <h5 className="font-semibold text-lg">
                          {activity.title || activity.activity_ref_name!.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h5>
                      )}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {activity.duration && (
                          <span className="text-sm text-muted-foreground px-1 py-0.5 rounded-md">
                            {activity.duration}
                          </span>
                        )}
                        {activity.activity_id !== "rest" && activity.price != null && (
                          <span className="text-sm font-medium text-primary px-1 py-0.5 rounded-md">
                            {activity.price.toLocaleString()} $
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mb-2">{activity.narrative_text}</p>
                    {activity.activity_id !== "rest" && activity.activity_ref_name && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/${lang}/activity/${activity.activity_ref_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t('itineraryBuilder.common.viewDetails') || "View Details"}
                        </Link>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
