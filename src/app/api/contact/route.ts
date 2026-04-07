import { NextResponse } from "next/server";
import { sendNotificationEmail, sendConfirmationEmail } from "@/lib/mail";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email, message, phone } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Store in Supabase
    const { error: dbError } = await supabase
      .from('contacts')
      .insert([{ name, email, message, phone }]);

    if (dbError) {
      console.error("Supabase storage error:", dbError);
      // We continue with email even if DB fails, or we could bail. 
      // For now, let's just log it and try to send the email.
    }

    // 2. Process via Nodemailer
    // Notify Admin
    await sendNotificationEmail({ name, email, message });
    
    // Confirm to User
    await sendConfirmationEmail({ name, email });

    return NextResponse.json({ 
      success: true, 
      message: "Lead transmitted and stored successfully." 
    });
  } catch (error: any) {
    console.error("Contact API error Details:", error);
    return NextResponse.json({ 
      error: "Transmission Failed", 
      details: error.message 
    }, { status: 500 });
  }
}
