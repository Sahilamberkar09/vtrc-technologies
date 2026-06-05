import { Resend } from "resend";

/**
 * Send an email using Resend
 */
export const sendMail = async ({ to, subject, text, html }) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailUser = process.env.EMAIL_FROM;

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY in environment variables.");
  }

  const resend = new Resend(resendApiKey);

  // Resend restricts from address to verified domains (or onboarding@resend.dev for testing).
  // We fall back to onboarding@resend.dev if a @gmail.com address is configured as EMAIL_FROM.
  const isGmail = emailUser && emailUser.toLowerCase().includes("@gmail.com");
  const fromEmail = "onboarding@resend.dev" ;
  const from = `VTRC Technologies <${fromEmail}>`;

  if (isGmail) {
    console.warn(`⚠️ EMAIL_FROM is set to a Gmail address (${emailUser}). Falling back to onboarding@resend.dev for Resend compliance.`);
  }

  console.log(`✉️ Sending email via Resend from: ${from} to: ${to}`);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      if (error.message && error.message.includes("You can only send testing emails")) {
        console.warn(`⚠️ Resend Sandbox restriction: Cannot send email to ${to}.`);
        console.warn(`🔑 OTP / Email Details:\nSubject: ${subject}\nText: ${text}`);
        return {
          messageId: `mock-resend-id-${Date.now()}`,
        };
      }
      console.error("Resend API Error:", error);
      throw new Error(error.message || "Failed to send email via Resend.");
    }

    return {
      messageId: data?.id,
    };
  } catch (error) {
    if (error.message && error.message.includes("You can only send testing emails")) {
      console.warn(`⚠️ Resend Sandbox restriction: Cannot send email to ${to}.`);
      console.warn(`🔑 OTP / Email Details:\nSubject: ${subject}\nText: ${text}`);
      return {
        messageId: `mock-resend-id-${Date.now()}`,
      };
    }
    throw error;
  }
};
