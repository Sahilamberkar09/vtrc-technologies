// Re-export controllers from new otpController.js file
// All legacy Nodemailer imports and implementation details have been removed
export { sendEmailOtp, verifyEmailOtp } from "./otpController.js";
