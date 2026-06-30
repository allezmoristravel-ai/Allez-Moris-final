import 'server-only';
import { ENABLED_LOCALES } from '@/config/i18n.config';

const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.allezmoristravel.com';

const languages = ENABLED_LOCALES;

/**
 * Generate canonical + hreflang alternates for a given page.
 * @param lang  Current language (e.g. "en")
 * @param path  Page path WITHOUT the language prefix (e.g. "/about", "" for home)
 */
export function getAlternates(lang: string, path: string = '') {
    return {
        canonical: `${baseUrl}/${lang}${path}`,
        languages: Object.fromEntries(
            languages.map((l) => [l, `${baseUrl}/${l}${path}`])
        ),
    };
}

export { baseUrl, languages };
