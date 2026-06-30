import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, adults, children, checkIn, checkOut, message, itemName, type, flightDetails } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // booking.requests has no columns for type/end_date/flight_details/adults+children split,
        // so anything that doesn't fit a dedicated column is folded into `notes`.
        // reference and activity_ref are left null — the back office assigns those later.
        const extraNotes = [
            `Type: ${type}`,
            `Adults: ${adults ?? 1}, Children: ${children ?? 0}`,
            checkOut ? `Check-out/Drop-off: ${checkOut}` : null,
            flightDetails ? `Flight details: ${flightDetails}` : null,
            message ? `Message: ${message}` : null,
        ].filter(Boolean).join('\n');

        const { error: supabaseError } = await supabase.from('requests').insert({
            customer_name: name,
            customer_email: email,
            customer_phone: phone || null,
            activity_name: itemName,
            requested_date: checkIn || null,
            party_size: (adults ?? 1) + (children ?? 0),
            notes: extraNotes,
            status: 'pending_review',
        });

        if (supabaseError) {
            console.error("Supabase insert error:", supabaseError);
            return NextResponse.json({ error: 'Failed to save booking request' }, { status: 500 });
        }

        // Email notification is best-effort — it must not block or fail the request
        // now that Supabase is the source of truth for the booking request.
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error("RESEND_API_KEY is missing — skipping email notification");
            return NextResponse.json({ success: true });
        }

        const resend = new Resend(resendApiKey);
        const typeLabel = type === 'accommodation' ? 'Accommodation' : type === 'rental' ? 'Car Rental' : type === 'transfer' ? 'Airport Transfer' : type === 'activity' ? 'Activity' : 'Enquiry';

        try {
            await resend.emails.send({
                from: 'Allez Moris <onboarding@resend.dev>',
                to: [process.env.ADMIN_EMAIL as string],
                subject: `New ${typeLabel} Enquiry: ${itemName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #e8a838, #f0c060); padding: 24px; border-radius: 12px 12px 0 0;">
                            <h1 style="color: #fff; margin: 0; font-size: 24px;">New ${typeLabel} Enquiry</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">For: ${itemName}</p>
                        </div>

                        <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #333; font-size: 18px; margin-top: 0;">Contact Details</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                                <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                                ${phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
                                ${adults ? `<tr><td style="padding: 8px 0; color: #666;">Adults</td><td style="padding: 8px 0;">${adults}</td></tr>` : ''}
                                ${children ? `<tr><td style="padding: 8px 0; color: #666;">Children</td><td style="padding: 8px 0;">${children}</td></tr>` : ''}
                            </table>

                            <h2 style="color: #333; font-size: 18px; margin-top: 24px;">Booking Details</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                ${checkIn ? `<tr><td style="padding: 8px 0; color: #666;">Date/Check-in</td><td style="padding: 8px 0; font-weight: bold;">${checkIn}</td></tr>` : ''}
                                ${checkOut ? `<tr><td style="padding: 8px 0; color: #666;">Check-out</td><td style="padding: 8px 0; font-weight: bold;">${checkOut}</td></tr>` : ''}
                                ${flightDetails ? `<tr><td style="padding: 8px 0; color: #666;">Flight Details</td><td style="padding: 8px 0; font-weight: bold;">${flightDetails}</td></tr>` : ''}
                            </table>

                            ${message ? `
                                <h2 style="color: #333; font-size: 18px; margin-top: 24px;">Message</h2>
                                <p style="color: #555; background: #f9f9f9; padding: 16px; border-radius: 8px; white-space: pre-line;">${message}</p>
                            ` : ''}
                        </div>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error("Enquiry email error:", emailError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Enquiry error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
