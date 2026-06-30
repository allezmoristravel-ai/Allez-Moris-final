import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { ENABLED_LOCALES, DEFAULT_LOCALE } from "@/config/i18n.config";

const locales = ENABLED_LOCALES;
const defaultLocale = DEFAULT_LOCALE;

function getLocale(request: NextRequest): string {
    // 1. Check if user has a preferred locale in cookies
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale && locales.includes(cookieLocale as typeof locales[number])) {
        return cookieLocale;
    }

    // 2. Fallback to browser headers
    const headers = { "accept-language": request.headers.get("accept-language") || "" };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, assets, api)
        '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)',
    ],
};
