import { RequestHandler } from "express";

// Mock payment methods data
const mockPaymentMethods = [
  {
    id: "pm-1",
    userId: "user-123",
    type: "card",
    brand: "visa",
    name: "Visa Card",
    last4: "4242",
    expiryDate: "12/25",
    isDefault: true,
    isVerified: true,
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "pm-2",
    userId: "user-123",
    type: "bank",
    brand: "bank",
    name: "Chase Bank Account",
    last4: "6789",
    accountType: "checking",
    isDefault: false,
    isVerified: true,
    createdAt: "2023-02-20T10:00:00Z",
  },
  {
    id: "pm-3",
    userId: "user-123",
    type: "card",
    brand: "mastercard",
    name: "Mastercard",
    last4: "5555",
    expiryDate: "08/24",
    isDefault: false,
    isVerified: true,
    createdAt: "2023-03-10T10:00:00Z",
  },
];

/**
 * GET /api/payment-methods
 * List all payment methods
 */
export const listPaymentMethods: RequestHandler = (req, res) => {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const methods = mockPaymentMethods.filter((m) => m.userId === userId);

  res.json({
    success: true,
    data: {
      paymentMethods: methods,
      count: methods.length,
    },
  });
};

/**
 * GET /api/payment-methods/:methodId
 * Get specific payment method
 */
export const getPaymentMethod: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { methodId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const method = mockPaymentMethods.find(
    (m) => m.id === methodId && m.userId === userId
  );

  if (!method) {
    return res.status(404).json({
      success: false,
      error: "Payment method not found",
    });
  }

  res.json({
    success: true,
    data: method,
  });
};

/**
 * POST /api/payment-methods
 * Add new payment method
 */
export const addPaymentMethod: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { type, brand, name, last4, expiryDate, accountType } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (!type || !name || !last4) {
    return res.status(400).json({
      success: false,
      error: "Type, name, and last 4 digits are required",
    });
  }

  const newMethod = {
    id: `pm-${Date.now()}`,
    userId,
    type,
    brand: brand || type,
    name,
    last4,
    expiryDate: expiryDate || undefined,
    accountType: accountType || undefined,
    isDefault: false,
    isVerified: false, // Will be verified via Stripe
    createdAt: new Date().toISOString(),
  };

  mockPaymentMethods.push(newMethod);

  res.status(201).json({
    success: true,
    data: newMethod,
    message: "Payment method added. Please verify to use for transactions.",
  });
};

/**
 * PUT /api/payment-methods/:methodId
 * Update payment method
 */
export const updatePaymentMethod: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { methodId } = req.params;
  const { name, isDefault } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const method = mockPaymentMethods.find(
    (m) => m.id === methodId && m.userId === userId
  );

  if (!method) {
    return res.status(404).json({
      success: false,
      error: "Payment method not found",
    });
  }

  if (name) {
    method.name = name;
  }

  if (isDefault === true) {
    // Unset other default methods
    mockPaymentMethods.forEach((m) => {
      if (m.userId === userId && m.id !== methodId) {
        m.isDefault = false;
      }
    });
    method.isDefault = true;
  }

  res.json({
    success: true,
    data: method,
    message: "Payment method updated successfully",
  });
};

/**
 * POST /api/payment-methods/:methodId/verify
 * Verify payment method
 */
export const verifyPaymentMethod: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { methodId } = req.params;
  const { verificationCode } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const method = mockPaymentMethods.find(
    (m) => m.id === methodId && m.userId === userId
  );

  if (!method) {
    return res.status(404).json({
      success: false,
      error: "Payment method not found",
    });
  }

  if (!verificationCode) {
    return res.status(400).json({
      success: false,
      error: "Verification code is required",
    });
  }

  // In production: verify with Stripe or payment provider
  method.isVerified = true;

  res.json({
    success: true,
    data: method,
    message: "Payment method verified successfully",
  });
};

/**
 * DELETE /api/payment-methods/:methodId
 * Remove payment method
 */
export const deletePaymentMethod: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { methodId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const methodIndex = mockPaymentMethods.findIndex(
    (m) => m.id === methodId && m.userId === userId
  );

  if (methodIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Payment method not found",
    });
  }

  const deletedMethod = mockPaymentMethods.splice(methodIndex, 1);

  res.json({
    success: true,
    data: deletedMethod[0],
    message: "Payment method deleted successfully",
  });
};
