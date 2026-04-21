import { ErrorRequestHandler } from "express";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Global error handling middleware
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const appError = err as AppError;

  // Log error for debugging (in production, use a proper logger)
  console.error("Error:", {
    message: appError.message,
    code: appError.code,
    stack: appError.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = appError.statusCode || 500;
  const message =
    appError.message || "An unexpected error occurred";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && {
      code: appError.code,
      stack: appError.stack,
    }),
  });
};

/**
 * Helper function to create an app error
 */
export function createError(
  message: string,
  statusCode: number = 500,
  code?: string
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}
