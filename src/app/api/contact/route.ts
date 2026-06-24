import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    console.log(`[Contact API Submission Received] Name: ${name}, Email: ${email}`);

    // If Resend API key is available, send email using Resend HTTP API
    if (process.env.RESEND_API_KEY) {
      const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@nointro.agency';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'NoIntro Form <onboarding@resend.dev>',
          to: contactEmail,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
              <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #000;">New Inquiry Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p style="margin-top: 20px;"><strong>Message:</strong></p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #000; white-space: pre-wrap;">${message}</div>
            </div>
          `
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Contact API Resend Error]', errorText);
        throw new Error(`Email delivery service failed with status ${response.status}: ${errorText}`);
      }
      
      console.log('[Contact API Email Delivered Successfully via Resend]');
    } else {
      console.log('[Contact API] RESEND_API_KEY environment variable not found. Submission logged to console only.');
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Contact API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
