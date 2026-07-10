import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: "BingeStudy Contact <onboarding@resend.dev>", // dpdns.org gets blocked by Gmail (no sender reputation) — revisit on a real purchased domain
      to: "bingestudy.app@gmail.com",
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
