
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getSupabaseBucketList } from '@/lib/supabaseBucketList';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, country, people, firstTime, reason, experience, activities, startDate, endDate, notes } = body;

    if (!name || !email || !phone || !country) {
      return NextResponse.json({ error: 'Name, email, phone and country are required' }, { status: 400 });
    }

    let supabaseBucketList;
    try {
      supabaseBucketList = getSupabaseBucketList();
    } catch (configError) {
      console.error("Bucket list Supabase config error:", configError);
      return NextResponse.json({ error: 'Bucket list submissions are not configured on the server' }, { status: 500 });
    }

    const { error: supabaseError } = await supabaseBucketList.from('bucket_list_submissions').insert({
      name,
      email,
      phone,
      people: Number.isFinite(Number(people)) ? Number(people) : 1,
      country,
      first_time: typeof firstTime === 'boolean' ? firstTime : null,
      reason: reason || [],
      experience: experience || [],
      activities: activities || {},
      start_date: startDate || null,
      end_date: endDate || null,
      notes: notes || '',
    });

    if (supabaseError) {
      console.error("Supabase insert error:", supabaseError);
      return NextResponse.json({ error: 'Failed to save bucket list submission' }, { status: 500 });
    }

    // Email notification is best-effort — Supabase is the source of truth for the submission.
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is missing — skipping email notification");
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(resendApiKey);

    try {
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
        console.error("Bucket list email error:", error);
        // TEMP DEBUG: surfacing the Resend error to diagnose missing emails.
        // Revert once resolved — email failures should stay best-effort/silent.
        return NextResponse.json({ success: true, emailDebugError: error });
      }

      return NextResponse.json({ success: true, data });
    } catch (emailError) {
      console.error("Bucket list email error:", emailError);
      // TEMP DEBUG: see comment above.
      return NextResponse.json({ success: true, emailDebugError: String(emailError) });
    }
  } catch (error) {
    console.error("Bucket list submission error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
