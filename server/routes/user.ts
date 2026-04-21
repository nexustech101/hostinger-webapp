import { RequestHandler } from "express";

// Mock user data
const mockUser = {
  id: "user-123",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  businessName: "John's Freelance Services",
  createdAt: "2023-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
};

/**
 * GET /api/users/profile
 * Get current user profile
 */
export const getUserProfile: RequestHandler = (req, res) => {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  res.json({
    success: true,
    data: mockUser,
  });
};

/**
 * PUT /api/users/profile
 * Update user profile
 */
export const updateUserProfile: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { firstName, lastName, email, phone, businessName } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  // Validate input
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      error: "First name, last name, and email are required",
    });
  }

  // In production, update in database
  const updatedUser = {
    ...mockUser,
    firstName,
    lastName,
    email,
    phone: phone || mockUser.phone,
    businessName: businessName || mockUser.businessName,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: updatedUser,
    message: "Profile updated successfully",
  });
};

/**
 * PUT /api/users/settings
 * Update user preferences
 */
export const updateUserSettings: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { currency, theme, notifications } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  // In production, save to database
  const userSettings = {
    currency: currency || "USD",
    theme: theme || "light",
    notifications: {
      email: notifications?.email !== false,
      transactionAlerts: notifications?.transactionAlerts !== false,
      weeklyReport: notifications?.weeklyReport !== false,
    },
  };

  res.json({
    success: true,
    data: userSettings,
    message: "Settings updated successfully",
  });
};

/**
 * DELETE /api/users/account
 * Delete user account (requires confirmation)
 */
export const deleteUserAccount: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { password } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: "Password required for account deletion",
    });
  }

  // In production:
  // 1. Verify password
  // 2. Delete all associated data (wallets, transactions, etc.)
  // 3. Delete user account

  res.json({
    success: true,
    message: "Account deleted successfully",
  });
};
