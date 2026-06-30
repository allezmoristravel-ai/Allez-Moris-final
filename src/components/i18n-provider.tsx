"use client";

import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { useMemo } from "react";

// Initialize a new instance for every request to avoid shared state on edge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createInstance(locale: string, resources: Record<string, any>) {
    const i18n = i18next.createInstance();
    i18n.use(initReactI18next).init({
        lng: locale,
        resources: {
            [locale]: {
                translation: resources,
            },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });
    return i18n;
}

export default function I18nProvider({
                                         children,
                                         locale,
                                         resources,
                                     }: {
    children: React.ReactNode;
    locale: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resources: Record<string, any>;
}) {
    const i18n = useMemo(() => createInstance(locale, resources), [locale, resources]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
