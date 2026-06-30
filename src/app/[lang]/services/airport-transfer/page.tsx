import type { Metadata } from "next";
import {
    Car,
    Users,
    MapPin,
    CheckCircle2,
    Plane,
    Clock,
    Info,
    Baby,
    Plus,
    Bus,
    Crown
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import EnquireFormDialog from "@/components/EnquireFormDialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    return {
        title: dict.metadata?.transfer?.title,
        description: dict.metadata?.transfer?.description,
        alternates: getAlternates(params.lang, "/services/airport-transfer"),
    };
}

export default async function AirportTransferPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dict: Record<string, any> = await getDictionary(params.lang);

    const vehicles = [
        {
            type: dict.services.transfer.VehicleCategories.Types.Standard,
            capacity: dict.services.transfer.VehicleCategories.Capacity.Standard,
            idealFor: dict.services.transfer.VehicleCategories.IdealFor.Standard,
            icon: Car,
            color: "text-blue-500",
        },
        {
            type: dict.services.transfer.VehicleCategories.Types.Family,
            capacity: dict.services.transfer.VehicleCategories.Capacity.Family,
            idealFor: dict.services.transfer.VehicleCategories.IdealFor.Family,
            icon: Users,
            color: "text-green-500",
        },
        {
            type: dict.services.transfer.VehicleCategories.Types.Coach,
            capacity: dict.services.transfer.VehicleCategories.Capacity.Coach,
            idealFor: dict.services.transfer.VehicleCategories.IdealFor.Coach,
            icon: Bus,
            color: "text-orange-500",
        },
        {
            type: dict.services.transfer.VehicleCategories.Types.Luxury,
            capacity: dict.services.transfer.VehicleCategories.Capacity.Luxury,
            idealFor: dict.services.transfer.VehicleCategories.IdealFor.Luxury,
            icon: Crown,
            color: "text-purple-500",
        },
    ];

    const priceData = [
        { destination: "Mahebourg (Nearby Airport Area)", standard: "€20", family: "€30", coach: "€65", luxury: "€60" },
        { destination: "Port Louis (Capital)", standard: "€40", family: "€55", coach: "€95", luxury: "€120" },
        { destination: "Flic en Flac (West Coast)", standard: "€50", family: "€60", coach: "€125", luxury: "€120" },
        { destination: "Grand Baie / North", standard: "€50", family: "€60", coach: "€125", luxury: "€120" },
        { destination: "Le Morne (South-West)", standard: "€50", family: "€60", coach: "€125", luxury: "€120" },
        { destination: "Flacq (East)", standard: "€50", family: "€60", coach: "€125", luxury: "€120" },
    ];

    const inclusions = Object.values(dict.services.transfer.Inclusions.List) as string[];

    return (
        <div className="bg-[url('/sand-background-phone.png')] md:bg-[url('/sand_background.png')] bg-cover bg-fixed bg-center bg-no-repeat min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                            <Plane className="w-5 h-5 text-primary" />
                            <span className="font-medium text-primary">{dict.services.transfer.Badge}</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            {dict.services.transfer.Title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            {dict.services.transfer.Description}
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-10 md:-mt-16 relative z-10">
                {/* Vehicle Categories */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {dict.services.transfer.VehicleCategories.Title}
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-px w-12 bg-border" />
                        <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                            {dict.services.transfer.VehicleCategories.Subtitle}
                        </span>
                        <span className="h-px w-12 bg-border" />
                    </div>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {dict.services.transfer.VehicleCategories.Description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {vehicles.map((v) => (
                        <Card key={v.type} className="shadow-lg hover:shadow-xl transition-shadow border-t-4" style={{ borderColor: 'var(--primary)' }}>
                            <CardHeader className="pb-2">
                                <div className={`w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-4 ${v.color}`}>
                                    <v.icon className="w-7 h-7" />
                                </div>
                                <CardTitle className="text-xl">{v.type}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>{v.capacity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        <span>{v.idealFor}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Price Guide */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <h2 className="font-serif text-3xl font-bold mb-4">📍 {dict.services.transfer.PriceGuide.Title}</h2>
                        <p className="text-muted-foreground">{dict.services.transfer.PriceGuide.Subtitle}</p>
                    </div>

                    <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                        <Table>
                            <TableHeader className="bg-secondary/30">
                                <TableRow>
                                    <TableHead className="w-[30%] font-bold text-foreground">{dict.services.transfer.PriceGuide.Headers.Destination}</TableHead>
                                    <TableHead className="font-bold text-blue-600">{dict.services.transfer.PriceGuide.Headers.Standard}</TableHead>
                                    <TableHead className="font-bold text-green-600">{dict.services.transfer.PriceGuide.Headers.Family}</TableHead>
                                    <TableHead className="font-bold text-orange-600">{dict.services.transfer.PriceGuide.Headers.Coach}</TableHead>
                                    <TableHead className="font-bold text-purple-600">{dict.services.transfer.PriceGuide.Headers.Luxury}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {priceData.map((row) => (
                                    <TableRow key={row.destination}>
                                        <TableCell className="font-medium">{row.destination}</TableCell>
                                        <TableCell>{row.standard}</TableCell>
                                        <TableCell>{row.family}</TableCell>
                                        <TableCell>{row.coach}</TableCell>
                                        <TableCell>{row.luxury}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4 italic mb-8">
                        {dict.services.transfer.PriceGuide.Note}
                    </p>
                    <div className="text-center">
                        <EnquireFormDialog
                            itemName={dict.services.transfer.Title || "Airport Transfer"}
                            type="transfer"
                            trigger={
                                <Button size="lg" className="rounded-full px-8 h-12 text-lg font-medium shadow-md hover:shadow-lg transition-all">
                                    {dict.activity?.checkAvailability || "Pre-book"}
                                </Button>
                            }
                        />
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
                    {/* What's Included */}
                    <div>
                        <h3 className="flex items-center gap-2 font-serif text-2xl font-bold mb-6">
                            <span className="bg-primary/10 p-2 rounded-full"><CheckCircle2 className="w-6 h-6 text-primary" /></span>
                            {dict.services.transfer.Inclusions.Title}
                        </h3>
                        <ul className="space-y-3">
                            {inclusions.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Optional Add-ons */}
                    <div>
                        <h3 className="flex items-center gap-2 font-serif text-2xl font-bold mb-6">
                            <span className="bg-primary/10 p-2 rounded-full"><Plus className="w-6 h-6 text-primary" /></span>
                            {dict.services.transfer.Addons.Title}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                <Baby className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-medium mb-1">{dict.services.transfer.Addons.ChildSeats}</h4>
                                    <p className="text-sm text-muted-foreground">{dict.services.transfer.Addons.ChildSeatsDesc}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                <MapPin className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-medium mb-1">{dict.services.transfer.Addons.ExtraStops}</h4>
                                    <p className="text-sm text-muted-foreground">{dict.services.transfer.Addons.ExtraStopsDesc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info & Notes */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Waiting Time */}
                    <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <Clock className="w-5 h-5" />
                                {dict.services.transfer.Info.WaitingTime}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm">
                                <span className="font-semibold block mb-1">{dict.services.transfer.Info.Arrival}</span>
                                {dict.services.transfer.Info.ArrivalDesc}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold block mb-1">{dict.services.transfer.Info.Departure}</span>
                                {dict.services.transfer.Info.DepartureDesc}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700">
                                <Info className="w-5 h-5" />
                                {dict.services.transfer.Info.ImportantNotes}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-amber-900/80">
                                {(Object.values(dict.services.transfer.Info.NotesList) as string[]).map((note, i) => (
                                    <li key={i}>{note}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
