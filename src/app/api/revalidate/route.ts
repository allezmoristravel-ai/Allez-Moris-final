import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { ENABLED_LOCALES } from '@/config/i18n.config';

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    for (const locale of ENABLED_LOCALES) {
        revalidatePath(`/${locale}`, 'page');
    }

    return NextResponse.json({ revalidated: true, locales: ENABLED_LOCALES, now: Date.now() });
}
