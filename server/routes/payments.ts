import { RequestHandler } from "express";

// Mock payments data
const mockPayments: any[] = [];

/**
 * POST /api/payments/process
 * Process payment via Stripe
 */
export const processPayment: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { amount, currency, paymentMethodId, description } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  // Validate input
  if (!amount || !paymentMethodId) {
    return res.status(400).json({
      success: false,
      error: "Amount and payment method are required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      error: "Amount must be greater than 0",
    });
  }

  // In production: Use Stripe API to process payment
  // const paymentIntent = await stripe.paymentIntents.create({...})

  const payment = {
    id: `pay-${Date.now()}`,
    userId,
    amount,
    currency: currency || "USD",
    paymentMethodId,
    description: description || "Payment",
    status: "processing", // Will be 'succeeded' or 'failed' after Stripe
    stripePaymentIntentId: `pi_${Date.now()}`, // Mock Stripe ID
    createdAt: new Date().toISOString(),
  };

  mockPayments.push(payment);

  res.status(201).json({
    success: true,
    data: payment,
    message: "Payment processing started",
  });
};

/**
 * GET /api/payments/:paymentId
 * Get payment status
 */
export const getPaymentStatus: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { paymentId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const payment = mockPayments.find(
    (p) => p.id === paymentId && p.userId === userId
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: "Payment not found",
    });
  }

  res.json({
    success: true,
    data: payment,
  });
};

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events
 * This endpoint should NOT require authentication
 */
export const handleStripeWebhook: RequestHandler = (req, res) => {
  const { type, data } = req.body;

  // In production:
  // 1. Verify webhook signature with Stripe
  // 2. Handle different event types (payment_intent.succeeded, etc.)
  // 3. Update payment status in database
  // 4. Trigger necessary actions (send confirmation email, update wallet, etc.)

  switch (type) {
    case "payment_intent.succeeded":
      console.log("Payment succeeded:", data.object.id);
      // Update payment status to 'succeeded'
      // Update wallet balance
      // Create transaction record
      break;

    case "payment_intent.payment_failed":
      console.log("Payment failed:", data.object.id);
      // Update payment status to 'failed'
      // Send failure notification
      break;

    case "charge.refunded":
      console.log("Charge refunded:", data.object.id);
      // Update payment status to 'refunded'
      // Reverse transaction
      // Send refund notification
      break;

    default:
      console.log("Unhandled event type:", type);
  }

  // Acknowledge receipt of webhook
  res.json({ received: true });
};

/**
 * POST /api/payments/:paymentId/refund
 * Refund a payment
 */
export const refundPayment: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { paymentId } = req.params;
  const { reason } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const payment = mockPayments.find(
    (p) => p.id === paymentId && p.userId === userId
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: "Payment not found",
    });
  }

  if (payment.status !== "succeeded") {
    return res.status(400).json({
      success: false,
      error: "Only succeeded payments can be refunded",
    });
  }

  // In production: Use Stripe refund API
  payment.status = "refunded";
  payment.refundReason = reason || "Customer requested";
  payment.refundedAt = new Date().toISOString();

  res.json({
    success: true,
    data: payment,
    message: "Payment refunded successfully",
  });
};

/**
 * GET /api/payments
 * List all payments for user
 */
export const listPayments: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { status, limit = "50" } = req.query;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  let payments = mockPayments.filter((p) => p.userId === userId);

  if (status) {
    payments = payments.filter((p) => p.status === status);
  }

  payments.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  const limitNum = parseInt(limit as string);
  payments = payments.slice(0, limitNum);

  res.json({
    success: true,
    data: {
      payments,
      count: payments.length,
    },
  });
};
