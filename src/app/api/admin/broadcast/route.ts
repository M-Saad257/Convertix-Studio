import { NextResponse } from "next/server";
import { sendDirectMessage } from "@/lib/mail";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, name, content } = await req.json();

    if (!email || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Send the Email
    await sendDirectMessage({ email, name: name || 'Valued Client', content });

    // 2. Log in History
    const { error: dbError } = await supabase
      .from('sent_messages')
      .insert([{
        recipient_email: email,
        recipient_name: name || 'Valued Client',
        subject: "Update from Convertix Studio",
        content: content
      }]);

    if (dbError) {
      console.error("Failed to log message to history:", dbError);
      // We don't return error here because the email was already sent successfully
    }

    return NextResponse.json({ success: true, message: "Transmission dispatched and logged." });
  } catch (error: any) {
    console.error("Broadcast API Error:", error);
    return NextResponse.json({ 
      error: "Transmission Failed", 
      details: error.message 
    }, { status: 500 });
  }
}
