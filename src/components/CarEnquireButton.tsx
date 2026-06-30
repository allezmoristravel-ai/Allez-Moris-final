"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import EnquireFormDialog from "@/components/EnquireFormDialog";

interface CarEnquireButtonProps {
    carModel: string;
    label: string;
}

export default function CarEnquireButton({ carModel, label }: CarEnquireButtonProps) {
    return (
        <EnquireFormDialog
            itemName={carModel}
            type="rental"
            trigger={
                <Button className="w-full md:w-auto self-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {label}
                </Button>
            }
        />
    );
}
