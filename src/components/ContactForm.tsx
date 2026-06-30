"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
    const { toast } = useToast();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast({
                    title: t("contactPage.form.success"),
                    description: t("contactPage.form.successDesc"),
                });
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            } else {
                toast({
                    title: t("contactPage.form.error"),
                    description: result.error || t("contactPage.form.errorDesc"),
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: t("contactPage.form.error"),
                description: t("contactPage.form.errorDesc"),
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-background/40 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-lg border border-border/50 space-y-6">
            <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name" className="mb-2 block">{t("contactPage.form.name")} *</Label>
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
                        <Label htmlFor="email" className="mb-2 block">{t("contactPage.form.email")} *</Label>
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
                </div>

                <div>
                    <Label htmlFor="subject" className="mb-2 block">{t("contactPage.form.subject")} *</Label>
                    <Input
                        id="subject"
                        placeholder="How can we help you?"
                        className="h-12"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="message" className="mb-2 block">{t("contactPage.form.message")} *</Label>
                    <Textarea
                        id="message"
                        placeholder="Tell us more about your trip..."
                        className="min-h-[150px]"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg mt-8"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t("contactPage.form.sending")}
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-2" />
                        {t("contactPage.form.submit")}
                    </>
                )}
            </Button>
        </form>
    );
};

export default ContactForm;
