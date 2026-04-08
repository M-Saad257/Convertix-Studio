import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendNotificationEmail = async (data: { name: string; email: string; message: string }) => {
  const mailOptions = {
    from: `"Convertix Studio" <${process.env.EMAIL_USER || "contact.convertix@gmail.com"}>`,
    to: "contact.convertix@gmail.com",
    subject: `New Convertix Strategy Request from ${data.name}`,
    text: `You have received a new strategy inquiry.\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
    html: `
      <div style="font-family: sans-serif; background-color: #0b0b0b; color: white; padding: 40px; border-radius: 20px; border: 1px solid #333;">
        <h2 style="color: #3b82f6; font-style: italic; text-transform: uppercase; letter-spacing: 2px;">New Strategy Transmission</h2>
        <div style="margin-top: 20px; border-top: 1px solid #333; pt-20">
          <p><strong>Identity:</strong> <span style="color: #3b82f6;">${data.name}</span></p>
          <p><strong>Digital Mail:</strong> <span style="color: #3b82f6;">${data.email}</span></p>
          <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #3b82f6; margin-top: 20px; font-style: italic; color: #aaa;">
            "${data.message}"
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendConfirmationEmail = async (data: { name: string; email: string }) => {
  const mailOptions = {
    from: `"Convertix Studio" <${process.env.EMAIL_USER || "contact.convertix@gmail.com"}>`,
    to: data.email,
    subject: `Strategy Request Received - Convertix Studio`,
    html: `
      <div style="font-family: sans-serif; background-color: #0b0b0b; color: white; padding: 40px; border-radius: 20px; border: 1px solid #333;">
        <h2 style="color: #3b82f6; font-style: italic; text-transform: uppercase;">Transmission Received</h2>
        <p>Hello ${data.name},</p>
        <p>We have received your digital strategy request. Our team is currently analyzing your brand's potential and will be in contact within 24 hours.</p>
        <p style="color: #3b82f6; font-weight: bold; margin-top: 30px;">Let's build the future together.</p>
        <p style="font-size: 10px; color: #444; margin-top: 40px;">© ${new Date().getFullYear()} Convertix Studio. All Rights Reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendNewsletterNotification = async (email: string) => {
  const mailOptions = {
    from: `"Convertix Studio" <${process.env.EMAIL_USER || "contact.convertix@gmail.com"}>`,
    to: "contact.convertix@gmail.com",
    subject: `New Digital Intel Subscriber: ${email}`,
    html: `
      <div style="font-family: sans-serif; background-color: #0b0b0b; color: white; padding: 40px; border-radius: 20px;">
        <h2 style="color: #3b82f6; font-style: italic; text-transform: uppercase;">New Pipeline Subscriber</h2>
        <p>A new user has subscribed to your digital growth updates.</p>
        <p><strong>Subscriber Mail:</strong> <span style="color: #3b82f6;">${email}</span></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendOTPEmail = async (data: { email: string; code: string }) => {
  const mailOptions = {
    from: `"Convertix Studio" <${process.env.EMAIL_USER || "contact.convertix@gmail.com"}>`,
    to: data.email,
    subject: `Verification Code: ${data.code} - Convertix Studio`,
    html: `
      <div style="font-family: sans-serif; background-color: #0B0B0B; color: #FFFFFF; padding: 60px 40px; border-radius: 40px; border: 1px solid #222; max-width: 600px; margin: auto; text-align: center;">
        <h1 style="color: #3B82F6; font-size: 24px; font-weight: 900; font-style: italic; margin-bottom: 20px; letter-spacing: -1px;">IDENTITY VERIFICATION</h1>
        <p style="color: #777; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 4px; margin-bottom: 40px;">Secure Transmission Protocol</p>
        
        <div style="background-color: #111; border: 1px solid #333; padding: 30px; border-radius: 24px; margin-bottom: 40px;">
          <h2 style="color: #3B82F6; font-size: 48px; font-weight: 900; margin: 0; letter-spacing: 12px; font-family: monospace;">${data.code}</h2>
        </div>
        
        <p style="color: #AAA; line-height: 1.6; margin-bottom: 40px; font-size: 14px;">Enter this code into the strategy request form to verify your identity and send your message. <br/><span style="color: #FF4D4D;">Code expires in 5 minutes.</span></p>
        
        <div style="border-top: 1px solid #222; padding-top: 30px;">
          <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px;">© ${new Date().getFullYear()} Convertix Studio // Digital Growth Agency</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendDirectMessage = async (data: { email: string; name: string; content: string }) => {
  const mailOptions = {
    from: `"Convertix Studio" <${process.env.EMAIL_USER || "contact.convertix@gmail.com"}>`,
    to: data.email,
    subject: `Update from Convertix Studio`,
    html: `
      <div style="font-family: sans-serif; background-color: #0B0B0B; color: #FFFFFF; padding: 60px 40px; border-radius: 40px; border: 1px solid #222; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #3B82F6; font-size: 24px; font-weight: 900; font-style: italic; margin: 0; letter-spacing: -1px;">OFFICIAL TRANSMISSION</h1>
          <p style="color: #444; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 4px; margin-top: 5px;">Convertix Digital Growth Protocol</p>
        </div>
        
        <div style="background-color: #111; border: 1px solid #333; padding: 40px; border-radius: 24px; margin-bottom: 40px; line-height: 1.8;">
          <p style="color: #777; font-size: 12px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">Dear ${data.name.toUpperCase()},</p>
          <div style="color: #EEE; font-size: 16px;">
            ${data.content.replace(/\n/g, '<br/>')}
          </div>
        </div>
        
        <p style="color: #555; font-size: 12px; text-align: center; margin-bottom: 40px;">This is a direct response to your recent digital strategy request.</p>
        
        <div style="border-top: 1px solid #222; padding-top: 30px; text-align: center;">
          <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0;">© ${new Date().getFullYear()} Convertix Studio // Building the Digital Future</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
