
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
    const { name, email, startDate, endDate } = body;

    const { data, error } = await resend.emails.send({
      from: 'Allez Moris <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL as string],
      subject: `New Bucket List from ${name}`,
      html: `
        <h1>New Bucket List Submission</h1>
        <h2>Guest Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Country:</strong> ${body.country}</p>
        <p><strong>People:</strong> ${body.people}</p>
        <p><strong>First Time:</strong> ${body.firstTime ? 'Yes' : 'No'}</p>
        
        <h2>Dates</h2>
        <p><strong>Arrival:</strong> ${startDate}</p>
        <p><strong>Departure:</strong> ${endDate}</p>

        <h2>Preferences</h2>
        <p><strong>Reason:</strong> ${body.reason?.join(', ')}</p>
        <p><strong>Experience:</strong> ${body.experience?.join(', ')}</p>

        <h2>Itinerary</h2>
        ${Object.entries(body.activities || {}).map(([category, items]) => `
          <h3>${category}</h3>
          <ul>
            ${(items as string[]).map(item => `<li>${item}</li>`).join('')}
          </ul>
        `).join('')}

        <h2>Notes</h2>
        <p>${body.notes || 'No notes'}</p>
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
