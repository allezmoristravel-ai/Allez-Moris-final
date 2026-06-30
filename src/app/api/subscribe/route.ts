import { Resend } from 'resend';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.error("RESEND_API_KEY is missing");
        return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    try {
        const body = await req.json();
        const { name, email } = body;

        const { data, error } = await resend.emails.send({
            from: 'Allez Moris <onboarding@resend.dev>',
            to: [process.env.ADMIN_EMAIL as string],
            subject: 'new subscription',
            html: `
        <h1>New Newsletter Subscription</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>User has entered the draw for the 100€ voucher.</p>
      `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
