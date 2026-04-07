import { NextResponse } from "next/server";
import { sendNotificationEmail, sendConfirmationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Process via Nodemailer
    // 1. Notify Admin
    await sendNotificationEmail({ name, email, message });
    
    // 2. Confirm to User
    await sendConfirmationEmail({ name, email });

    return NextResponse.json({ success: true, message: "Lead transmitted via email." });
  } catch (error: any) {
    console.error("Contact API error Details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return NextResponse.json({ 
      error: "Transmission Failed", 
      details: error.message 
    }, { status: 500 });
  }
}
