import { getDictionary } from "@/lib/i18n";

export const getTranslation = async (lang: string) => {
    const dictionary = await getDictionary(lang);

    return {
        t: (key: string, defaultValue?: string) => {
            const keys = key.split(".");
            let value: unknown = dictionary;

            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = (value as Record<string, unknown>)[k];
                } else {
                    return defaultValue ?? key;
                }
            }

            return (value as string) || defaultValue || key;
        },
    };
};
