import ContactForm from "@/components/ContactForm";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { getContactDetails } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";

export default async function ContactPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    const [contactDetails, dict] = await Promise.all([
        getContactDetails(params.lang),
        getDictionary(params.lang),
    ]);
    const cp = dict.contactPage as Record<string, string>;

    const email = contactDetails?.email || "info@allezmoristravel.com";
    const phone = contactDetails?.phoneNumber || "+230 5721 8070";
    const address = contactDetails?.address || "Mont Choisy, Mauritius";

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                        {cp.title}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {cp.description}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
                            <h2 className="text-2xl font-serif font-semibold mb-6">{cp.getInTouchTitle}</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">{cp.emailLabel}</p>
                                        <a href={`mailto:${email}`} className="font-medium hover:text-primary transition-colors">
                                            {email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">{cp.phoneLabel}</p>
                                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-medium block hover:text-primary transition-colors">
                                            {phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">{cp.businessHoursLabel}</p>
                                        <p className="font-medium">{cp.workingHours}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">{cp.locationLabel}</p>
                                        <p className="font-medium">{address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
