import nodemailer from "nodemailer";

/**
 * Send an email using Nodemailer and Gmail SMTP
 */
export const sendMail = async ({ to, subject, text, html }) => {
  const emailUser = process.env.EMAIL_FROM;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Missing EMAIL_FROM or EMAIL_PASS in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  console.log(`✉️ Sending email via Gmail SMTP from: ${emailUser} to: ${to}`);

  const info = await transporter.sendMail({
    from: `"VTRC Technologies" <${emailUser}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};
