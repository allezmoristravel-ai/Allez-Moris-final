"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { sendSubscriptionEmail } from "@/lib/resend";
import { useTranslation } from "react-i18next";
import { Loader2, Mail, Gift } from "lucide-react";

const SubscriptionForm = () => {
    const { toast } = useToast();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await sendSubscriptionEmail({
                name: formData.name,
                email: formData.email,
            });

            if (result.success) {
                toast({
                    title: t("subscribe.form.success"),
                    description: t("subscribe.description"),
                });
                setFormData({
                    name: "",
                    email: "",
                });
            } else {
                toast({
                    title: "Error",
                    description: t("subscribe.form.error"),
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: t("subscribe.form.error"),
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-16 md:py-24 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-background/40 backdrop-blur-md rounded-full px-4 py-2 mb-4">
                            <Gift className="w-5 h-5 text-primary" />
                            <span className="font-medium text-primary">100€ Voucher Giveaway</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {t("subscribe.title")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("subscribe.description")}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-background/40 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-lg border border-border/50 space-y-6">
                        <div>
                            <Label htmlFor="name" className="mb-2 block">{t("subscribe.form.name")}</Label>
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
                            <Label htmlFor="email" className="mb-2 block">{t("subscribe.form.email")}</Label>
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

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-lg mt-4"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5 mr-2" />
                                    {t("subscribe.form.submit")}
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SubscriptionForm;
