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
