import { createServerFn } from "@tanstack/react-start";
import Razorpay from "razorpay";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator((data: { amount: number; receipt: string; notes?: any }) => data)
  .handler(async (ctx) => {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys not configured on the server.");
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: ctx.data.amount * 100, // paise
      currency: "INR",
      receipt: ctx.data.receipt,
      notes: ctx.data.notes || {},
    };

    try {
      const order = await razorpay.orders.create(options);
      return { success: true, orderId: order.id };
    } catch (error: any) {
      console.error("Razorpay order creation failed:", error);
      throw new Error(error.description || "Failed to create Razorpay order");
    }
  });

export const verifyRazorpaySignature = createServerFn({ method: "POST" })
  .validator(
    (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => data
  )
  .handler(async (ctx) => {
    if (!RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret not configured on the server.");
    }

    const body = ctx.data.razorpay_order_id + "|" + ctx.data.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === ctx.data.razorpay_signature) {
      return { success: true };
    } else {
      return { success: false, error: "Invalid signature" };
    }
  });
