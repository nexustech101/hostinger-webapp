import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

// Auth routes
import {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "./routes/auth";

// User routes
import {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  deleteUserAccount,
} from "./routes/user";

// Wallet routes
import {
  listWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
  transferFunds,
} from "./routes/wallet";

// Transaction routes
import {
  getTransactions,
  getTransaction,
  createTransaction,
  exportTransactions,
  getCategories,
} from "./routes/transactions";

// Payment methods routes
import {
  listPaymentMethods,
  getPaymentMethod,
  addPaymentMethod,
  updatePaymentMethod,
  verifyPaymentMethod,
  deletePaymentMethod,
} from "./routes/cards";

// Payment processing routes
import {
  processPayment,
  getPaymentStatus,
  handleStripeWebhook,
  refundPayment,
  listPayments,
} from "./routes/payments";

// Invoice routes
import {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  sendInvoice,
  deleteInvoice,
  getInvoicePublic,
  recordPayment,
} from "./routes/invoices";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ==================== AUTH ROUTES ====================
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.post("/api/auth/refresh", authMiddleware, refreshToken);
  app.post("/api/auth/logout", authMiddleware, logout);
  app.post("/api/auth/forgot-password", forgotPassword);
  app.post("/api/auth/reset-password", resetPassword);

  // ==================== PROTECTED ROUTES (require auth) ====================

  // User routes
  app.get("/api/users/profile", authMiddleware, getUserProfile);
  app.put("/api/users/profile", authMiddleware, updateUserProfile);
  app.put("/api/users/settings", authMiddleware, updateUserSettings);
  app.delete("/api/users/account", authMiddleware, deleteUserAccount);

  // Wallet routes
  app.get("/api/wallets", authMiddleware, listWallets);
  app.post("/api/wallets", authMiddleware, createWallet);
  app.get("/api/wallets/:walletId", authMiddleware, getWallet);
  app.put("/api/wallets/:walletId", authMiddleware, updateWallet);
  app.delete("/api/wallets/:walletId", authMiddleware, deleteWallet);
  app.post("/api/wallets/:walletId/transfer", authMiddleware, transferFunds);

  // Transaction routes
  app.get("/api/transactions", authMiddleware, getTransactions);
  app.get("/api/transactions/categories", authMiddleware, getCategories);
  app.post("/api/transactions", authMiddleware, createTransaction);
  app.get("/api/transactions/:transactionId", authMiddleware, getTransaction);
  app.post("/api/transactions/export", authMiddleware, exportTransactions);

  // Payment methods routes
  app.get("/api/payment-methods", authMiddleware, listPaymentMethods);
  app.post("/api/payment-methods", authMiddleware, addPaymentMethod);
  app.get(
    "/api/payment-methods/:methodId",
    authMiddleware,
    getPaymentMethod
  );
  app.put(
    "/api/payment-methods/:methodId",
    authMiddleware,
    updatePaymentMethod
  );
  app.post(
    "/api/payment-methods/:methodId/verify",
    authMiddleware,
    verifyPaymentMethod
  );
  app.delete(
    "/api/payment-methods/:methodId",
    authMiddleware,
    deletePaymentMethod
  );

  // Payment processing routes
  app.get("/api/payments", authMiddleware, listPayments);
  app.post("/api/payments/process", authMiddleware, processPayment);
  app.get("/api/payments/:paymentId", authMiddleware, getPaymentStatus);
  app.post("/api/payments/:paymentId/refund", authMiddleware, refundPayment);
  // Webhook endpoint (no auth required - should verify Stripe signature)
  app.post("/api/payments/webhook", handleStripeWebhook);

  // ==================== INVOICE ROUTES ====================
  app.get("/api/invoices", authMiddleware, listInvoices);
  app.post("/api/invoices", authMiddleware, createInvoice);
  app.get("/api/invoices/:invoiceId", authMiddleware, getInvoice);
  app.put("/api/invoices/:invoiceId", authMiddleware, updateInvoice);
  app.post("/api/invoices/:invoiceId/send", authMiddleware, sendInvoice);
  app.delete("/api/invoices/:invoiceId", authMiddleware, deleteInvoice);
  app.post("/api/invoices/:invoiceId/payment", recordPayment); // Public endpoint for payment recording
  // Public invoice endpoint (for customer payment page - no auth)
  app.get("/api/invoices/public/:invoiceId", getInvoicePublic);

  // ==================== ERROR HANDLING ====================
  app.use(errorHandler);

  return app;
}
