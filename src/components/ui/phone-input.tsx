"use client";

import * as React from "react";
import ReactPhoneInput, { type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
    id?: string;
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    defaultCountry?: Country;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

// Wraps react-phone-number-input (libphonenumber-js) so every stored number
// is normalized to strict E.164 (+<country calling code><digits>, no
// spaces/dashes/parens) before it ever leaves the form.
export function PhoneInput({
    id,
    value,
    onChange,
    defaultCountry = "MU",
    placeholder,
    className,
    required,
}: PhoneInputProps) {
    return (
        <ReactPhoneInput
            id={id}
            international
            defaultCountry={defaultCountry}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:text-inherit [&_.PhoneInputInput]:placeholder:text-muted-foreground [&_.PhoneInputCountrySelect]:bg-background [&_.PhoneInputCountryIcon]:shadow-none",
                className,
            )}
        />
    );
}
