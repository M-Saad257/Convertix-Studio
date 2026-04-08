import { NextResponse } from "next/server";
import { sendNewsletterNotification } from "@/lib/mail";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 1. Store as a Lead in the Database (No OTP required for Newsletter)
    const { error: dbError } = await supabase
      .from('contacts')
      .insert([{ 
        name: "Newsletter Subscriber", 
        email: email, 
        message: "SYSTEM: User joined the digital intelligence pipeline via footer subscription." 
      }]);

    if (dbError) {
      console.error("Newsletter DB Storage Error:", dbError);
    }

    // 2. Process via Nodemailer Notification
    await sendNewsletterNotification(email);

    return NextResponse.json({ success: true, message: "Subscription active. Pipeline established." });
  } catch (error: any) {
    console.error("Subscribe API error:", error);
    return NextResponse.json({ 
        error: "Subscription Failed", 
        details: error.message 
    }, { status: 500 });
  }
}
