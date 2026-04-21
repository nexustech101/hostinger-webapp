import { RequestHandler } from "express";

// Mock user database
const mockUsers = [
  {
    id: "user-123",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    passwordHash: "hashed-password-123", // In production: use bcrypt
    createdAt: "2023-01-15T10:00:00Z",
  },
];

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * POST /api/auth/signup
 * Create new user account
 */
export const signup: RequestHandler = (req, res) => {
  const { email, password, firstName, lastName } = req.body as SignupRequest;

  // Validate input
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: "Email, password, first name, and last name are required",
    });
  }

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "Email already registered",
    });
  }

  // In production:
  // 1. Hash password with bcrypt
  // 2. Save to database
  // 3. Send verification email

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    firstName,
    lastName,
    passwordHash: "hashed-password-" + Date.now(),
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  // Generate JWT token
  const token = generateMockToken(newUser.id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      token,
    },
    message: "Account created successfully",
  });
};

/**
 * POST /api/auth/login
 * Authenticate user and get token
 */
export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body as LoginRequest;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  // Find user
  const user = mockUsers.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password",
    });
  }

  // In production: compare password with bcrypt
  // if (!await bcrypt.compare(password, user.passwordHash)) {
  //   return res.status(401).json({ ... })
  // }

  // Generate JWT token
  const token = generateMockToken(user.id);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
    message: "Login successful",
  });
};

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
export const refreshToken: RequestHandler = (req, res) => {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "User not found",
    });
  }

  // Generate new token
  const token = generateMockToken(user.id);

  res.json({
    success: true,
    data: {
      token,
    },
    message: "Token refreshed",
  });
};

/**
 * POST /api/auth/logout
 * Logout user (invalidate token)
 */
export const logout: RequestHandler = (req, res) => {
  // In a real implementation with JWTs, you might want to:
  // 1. Add token to blacklist
  // 2. Clear refresh token cookie
  // 3. Notify client to clear stored token

  res.json({
    success: true,
    message: "Logout successful",
  });
};

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
export const forgotPassword: RequestHandler = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
    });
  }

  const user = mockUsers.find((u) => u.email === email);

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: "Password reset link sent to email",
  });

  // In production:
  // 1. Generate reset token
  // 2. Save token with expiry to database
  // 3. Send email with reset link
};

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export const resetPassword: RequestHandler = (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Token and new password are required",
    });
  }

  // In production:
  // 1. Verify reset token validity and expiry
  // 2. Hash new password
  // 3. Update user password
  // 4. Invalidate reset token

  res.json({
    success: true,
    message: "Password reset successfully",
  });
};

/**
 * Helper: Generate mock JWT token
 * In production, use jsonwebtoken library
 */
function generateMockToken(userId: string): string {
  // This is a mock token. In production, use proper JWT signing with a secret key
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64");
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })
  ).toString("base64");
  const signature = Buffer.from("mock-signature").toString("base64");

  return `${header}.${payload}.${signature}`;
}
