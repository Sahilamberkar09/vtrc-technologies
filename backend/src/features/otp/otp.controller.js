import nodemailer from "nodemailer";

// In-memory OTP store: email -> { code, expiresAt, verified }
const otpStore = new Map();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create transporter — works on Render (Gmail SMTP via port 587 + TLS)
function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,       // STARTTLS — not raw SSL, required for port 587
    requireTLS: true,    // Force upgrade to TLS — essential for Render/cloud
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (not your account password)
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
}

// ── SEND OTP ──────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email address." });
    }

    const code = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    // Store OTP (overwrites any previous one for this email)
    otpStore.set(email.toLowerCase(), { code, expiresAt, verified: false });

    const fromName = "VTRC Technologies";
    const fromEmail = process.env.EMAIL_USER;

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: "Your OTP Code — VTRC Technologies",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5;">
          <div style="background: #000000; padding: 28px 32px;">
            <h1 style="margin: 0; color: #ffffff; font-size: 20px; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 800;">VTRC Technologies</h1>
          </div>
          <div style="padding: 40px 32px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Email Verification</p>
            <h2 style="margin: 0 0 24px; font-size: 26px; color: #111827; font-weight: 800;">Your one-time code</h2>
            <div style="background: #f9fafb; border: 2px solid #000000; padding: 24px; text-align: center; margin-bottom: 28px;">
              <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #000000; font-family: 'Courier New', monospace;">${code}</span>
            </div>
            <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; line-height: 1.6;">
              Enter this code in the contact form to verify your email address. This code expires in <strong style="color: #111827;">5 minutes</strong>.
            </p>
            <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          <div style="background: #f9fafb; border-top: 1px solid #e5e5e5; padding: 16px 32px;">
            <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em;">© ${new Date().getFullYear()} VTRC Technologies. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("sendOtp error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again." });
  }
};

// ── VERIFY OTP ────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP code are required." });
    }

    const record = otpStore.get(email.toLowerCase());

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found for this email. Please request a new one." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (record.code !== code.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    // Mark as verified
    otpStore.set(email.toLowerCase(), { ...record, verified: true });

    return res.status(200).json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ── EXPORTED STORE CHECK (used by inquiry controller) ─────
export { otpStore };
