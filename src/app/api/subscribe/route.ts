import { NextResponse } from "next/server";
import { sendNewsletterNotification } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Process via Nodemailer
    await sendNewsletterNotification(email);

    return NextResponse.json({ success: true, message: "Subscription active." });
  } catch (error: any) {
    console.error("Subscribe API error Details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    return NextResponse.json({ 
        error: "Subscription Failed", 
        details: error.message 
    }, { status: 500 });
  }
}
