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
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Allez Moris <onboarding@resend.dev>',
            to: [process.env.ADMIN_EMAIL as string],
            subject: `New Contact Request: ${subject || 'No Subject'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #e8a838, #f0c060); padding: 24px; border-radius: 12px 12px 0 0;">
                        <h1 style="color: #fff; margin: 0; font-size: 24px;">New Contact Message</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">From: ${name}</p>
                    </div>
                    
                    <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                        <h2 style="color: #333; font-size: 18px; margin-top: 0;">Contact Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                            ${subject ? `<tr><td style="padding: 8px 0; color: #666;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>` : ''}
                        </table>

                        <h2 style="color: #333; font-size: 18px; margin-top: 24px;">Message</h2>
                        <p style="color: #555; background: #f9f9f9; padding: 16px; border-radius: 8px; white-space: pre-line;">${message}</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Contact email error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
