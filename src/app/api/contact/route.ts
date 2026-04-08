import { NextResponse } from "next/server";
import { sendNotificationEmail, sendConfirmationEmail, sendOTPEmail } from "@/lib/mail";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { action, name, email, message, phone, code } = await req.json();

    if (action === "REQUEST_OTP") {
      if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

      // Generate 4-digit code
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

      // Store in Supabase
      const { error: otpError } = await supabase
        .from('otp_verifications')
        .insert([{ email, code: otpCode, expires_at: expiresAt }]);

      if (otpError) {
        console.error("OTP storage error:", otpError);
        return NextResponse.json({ error: "Failed to generate security code" }, { status: 500 });
      }

      // Send Email
      await sendOTPEmail({ email, code: otpCode });

      return NextResponse.json({ success: true, message: "Security code transmitted to your digital mail." });
    }

    if (action === "VERIFY_AND_SUBMIT") {
      if (!name || !email || !message || !code) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      // Verify OTP
      const { data: otpData, error: verifyError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (verifyError || !otpData || otpData.length === 0) {
        return NextResponse.json({ error: "Invalid or expired security code" }, { status: 401 });
      }

      // 1. Store Message in Supabase
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([{ name, email, message, phone }]);

      if (dbError) {
        console.error("Supabase storage error:", dbError);
      }

      // 2. Cleanup OTP (Optional)
      await supabase.from('otp_verifications').delete().eq('email', email);

      // 3. Process Emails
      await sendNotificationEmail({ name, email, message });
      await sendConfirmationEmail({ name, email });

      return NextResponse.json({ 
        success: true, 
        message: "Identity verified. Transmission successful." 
      });
    }

    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json({ 
      error: "Technical error occurred", 
      details: error.message 
    }, { status: 500 });
  }
}
