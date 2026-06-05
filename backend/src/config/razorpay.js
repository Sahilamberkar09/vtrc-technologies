import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

let instance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  } else {
    console.warn("Razorpay keys not found in environment variables. Razorpay features will not work.");
  }
} catch (error) {
  console.error("Razorpay Initialization Error:", error);
}

export default instance;
