import { RequestHandler } from "express";

/**
 * Authentication middleware to verify JWT tokens
 * In production, this should validate against a real JWT token
 * For now, it checks for an Authorization header
 */
export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid authorization header",
    });
  }

  // Extract token from Bearer schema
  const token = authHeader.substring(7);

  // In production: verify JWT token with a secret key
  // For now, we'll just store it in the request for later use
  (req as any).userId = "user-123"; // Mock user ID
  (req as any).token = token;

  next();
};

/**
 * Optional authentication - doesn't require token but uses it if provided
 */
export const optionalAuthMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    (req as any).userId = "user-123";
    (req as any).token = token;
  }

  next();
};
