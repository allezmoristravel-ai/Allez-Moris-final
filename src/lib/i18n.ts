import 'server-only';
import { ENABLED_LOCALES, DEFAULT_LOCALE, type Locale } from '@/config/i18n.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, () => Promise<Record<string, any>>> = {
    en: () => import('@/i18n/locales/en.json').then((module) => module.default),
    fr: () => import('@/i18n/locales/fr.json').then((module) => module.default),
    de: () => import('@/i18n/locales/de.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    const loc = locale as Locale;
    // Only serve dictionaries for enabled locales; fall back to default otherwise
    if (ENABLED_LOCALES.includes(loc) && dictionaries[loc]) {
        return dictionaries[loc]();
    }
    return dictionaries[DEFAULT_LOCALE]();
};
