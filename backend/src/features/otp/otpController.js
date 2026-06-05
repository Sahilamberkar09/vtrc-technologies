import { OTP } from "./otp.model.js";
import otpGenerator from "otp-generator";
import { sendMail } from "../../config/mailConfig.js";

/**
 * Controller to handle sending OTP via Nodemailer
 * POST /send-otp or /send-email-otp
 */
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Required field validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is a required field."
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Validation: Only allow valid Gmail addresses
    // Match strict Gmail address format
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed: Only valid Gmail addresses (@gmail.com) are allowed."
      });
    }

    // 3. Validation: Reject dummy or temporary email addresses
    const localPart = trimmedEmail.split("@")[0];
    const dummyKeywords = ["test", "dummy", "example", "temp", "fake", "placeholder", "admin"];
    const isDummy = dummyKeywords.some((keyword) => {
      // Match exact username, or usernames containing keywords separated by standard separators (like dots, underscores)
      return localPart === keyword || localPart.includes(keyword);
    });

    if (isDummy) {
      return res.status(400).json({
        success: false,
        message: "Validation failed: Dummy, test, or temporary email addresses are rejected."
      });
    }

    // 4. Cooldown Validation: Prevent generating multiple OTPs in rapid succession (e.g., 30s cooldown)
    const existingOtp = await OTP.findOne({ email: trimmedEmail }).sort({ createdAt: -1 });
    if (existingOtp) {
      const timeDiff = new Date() - existingOtp.createdAt;
      if (timeDiff < 30000) { // 30 seconds cooldown
        return res.status(429).json({
          success: false,
          message: "Please wait 30 seconds before requesting a new OTP."
        });
      }
    }

    // 5. Generate secure 6-digit random number
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    // 6. Store OTP temporarily in Mongoose DB (which expires and deletes automatically after 5 minutes via TTL index)
    await OTP.create({
      email: trimmedEmail,
      otp,
    });

    // 8. Prepare email content: exact subject & text format required by user
    const emailSubject = "Email Verification OTP";
    const emailBody = `Your OTP is: ${otp}\nThis OTP expires in 5 minutes.`;
    
    // Aesthetic HTML email wrapper for premium modern look
    const emailHtmlBody = `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Verification Required</h2>
        </div>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
          Please use the following One-Time Password (OTP) to verify your email address. This passcode is required to complete your verification.
        </p>
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; background-color: #f5f3ff; padding: 18px; text-align: center; border-radius: 12px; border: 1px dashed #c7d2fe; margin-bottom: 24px; font-family: 'Courier New', Courier, monospace;">
          ${otp}
        </div>
        <p style="color: #dc2626; font-size: 14px; font-weight: 600; text-align: center; margin-bottom: 0;">
          This OTP expires in 5 minutes.
        </p>
        <div style="margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 24px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
      </div>
    `;

    // 9. Send the email using Nodemailer
    const info = await sendMail({
      to: trimmedEmail,
      subject: emailSubject,
      text: emailBody,
      html: emailHtmlBody,
    });

    console.log(`OTP sent successfully. Message ID: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
      id: info.messageId,
    });
  } catch (error) {
    console.error("Error in sendEmailOtp:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while sending OTP."
    });
  }
};

/**
 * Controller to handle verifying OTP
 * POST /verify-otp or /verify-email-otp
 */
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Validation: Required fields validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Validation failed: Both email and OTP are required fields."
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Retrieve most recent OTP record for this email
    const record = await OTP.findOne({ email: trimmedEmail }).sort({ createdAt: -1 });

    // 3. Validation: Check if OTP exists / hasn't expired
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found. Please request a new one."
      });
    }

    // 4. Validation: Check if the OTP is correct
    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP provided."
      });
    }

    // 5. Clean up: Delete the verified OTP record to prevent reuse
    await OTP.deleteOne({ _id: record._id });

    // 6. Return successful JSON response
    return res.status(200).json({
      success: true,
      message: "Email verified successfully."
    });
  } catch (error) {
    console.error("Error in verifyEmailOtp:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during verification."
    });
  }
};
