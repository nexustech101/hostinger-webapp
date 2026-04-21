import path from "node:path";
import "dotenv/config";
import * as express$1 from "express";
import express from "express";
import cors from "cors";
//#region server/routes/demo.ts
var handleDemo = (req, res) => {
	res.status(200).json({ message: "Hello from Express server" });
};
//#endregion
//#region server/middleware/auth.ts
/**
* Authentication middleware to verify JWT tokens
* In production, this should validate against a real JWT token
* For now, it checks for an Authorization header
*/
var authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({
		success: false,
		error: "Missing or invalid authorization header"
	});
	const token = authHeader.substring(7);
	req.userId = "user-123";
	req.token = token;
	next();
};
//#endregion
//#region server/middleware/errorHandler.ts
/**
* Global error handling middleware
*/
var errorHandler = (err, req, res, next) => {
	const appError = err;
	console.error("Error:", {
		message: appError.message,
		code: appError.code,
		stack: appError.stack,
		path: req.path,
		method: req.method
	});
	const statusCode = appError.statusCode || 500;
	const message = appError.message || "An unexpected error occurred";
	res.status(statusCode).json({
		success: false,
		error: message
	});
};
//#endregion
//#region server/routes/auth.ts
var mockUsers = [{
	id: "user-123",
	email: "john@example.com",
	firstName: "John",
	lastName: "Doe",
	passwordHash: "hashed-password-123",
	createdAt: "2023-01-15T10:00:00Z"
}];
/**
* POST /api/auth/signup
* Create new user account
*/
var signup = (req, res) => {
	const { email, password, firstName, lastName } = req.body;
	if (!email || !password || !firstName || !lastName) return res.status(400).json({
		success: false,
		error: "Email, password, first name, and last name are required"
	});
	if (mockUsers.find((u) => u.email === email)) return res.status(400).json({
		success: false,
		error: "Email already registered"
	});
	const newUser = {
		id: `user-${Date.now()}`,
		email,
		firstName,
		lastName,
		passwordHash: "hashed-password-" + Date.now(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	mockUsers.push(newUser);
	const token = generateMockToken(newUser.id);
	res.status(201).json({
		success: true,
		data: {
			user: {
				id: newUser.id,
				email: newUser.email,
				firstName: newUser.firstName,
				lastName: newUser.lastName
			},
			token
		},
		message: "Account created successfully"
	});
};
/**
* POST /api/auth/login
* Authenticate user and get token
*/
var login = (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({
		success: false,
		error: "Email and password are required"
	});
	const user = mockUsers.find((u) => u.email === email);
	if (!user) return res.status(401).json({
		success: false,
		error: "Invalid email or password"
	});
	const token = generateMockToken(user.id);
	res.json({
		success: true,
		data: {
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			},
			token
		},
		message: "Login successful"
	});
};
/**
* POST /api/auth/refresh
* Refresh JWT token
*/
var refreshToken = (req, res) => {
	const userId = req.userId;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const user = mockUsers.find((u) => u.id === userId);
	if (!user) return res.status(401).json({
		success: false,
		error: "User not found"
	});
	const token = generateMockToken(user.id);
	res.json({
		success: true,
		data: { token },
		message: "Token refreshed"
	});
};
/**
* POST /api/auth/logout
* Logout user (invalidate token)
*/
var logout = (req, res) => {
	res.json({
		success: true,
		message: "Logout successful"
	});
};
/**
* POST /api/auth/forgot-password
* Request password reset
*/
var forgotPassword = (req, res) => {
	const { email } = req.body;
	if (!email) return res.status(400).json({
		success: false,
		error: "Email is required"
	});
	mockUsers.find((u) => u.email === email);
	res.json({
		success: true,
		message: "Password reset link sent to email"
	});
};
/**
* POST /api/auth/reset-password
* Reset password with token
*/
var resetPassword = (req, res) => {
	const { token, newPassword } = req.body;
	if (!token || !newPassword) return res.status(400).json({
		success: false,
		error: "Token and new password are required"
	});
	res.json({
		success: true,
		message: "Password reset successfully"
	});
};
/**
* Helper: Generate mock JWT token
* In production, use jsonwebtoken library
*/
function generateMockToken(userId) {
	return `${Buffer.from(JSON.stringify({
		alg: "HS256",
		typ: "JWT"
	})).toString("base64")}.${Buffer.from(JSON.stringify({
		userId,
		iat: Math.floor(Date.now() / 1e3),
		exp: Math.floor(Date.now() / 1e3) + 86400
	})).toString("base64")}.${Buffer.from("mock-signature").toString("base64")}`;
}
//#endregion
//#region server/routes/user.ts
var mockUser = {
	id: "user-123",
	firstName: "John",
	lastName: "Doe",
	email: "john@example.com",
	phone: "+1 (555) 123-4567",
	businessName: "John's Freelance Services",
	createdAt: "2023-01-15T10:00:00Z",
	updatedAt: "2024-01-15T10:00:00Z"
};
/**
* GET /api/users/profile
* Get current user profile
*/
var getUserProfile = (req, res) => {
	if (!req.userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	res.json({
		success: true,
		data: mockUser
	});
};
/**
* PUT /api/users/profile
* Update user profile
*/
var updateUserProfile = (req, res) => {
	const userId = req.userId;
	const { firstName, lastName, email, phone, businessName } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!firstName || !lastName || !email) return res.status(400).json({
		success: false,
		error: "First name, last name, and email are required"
	});
	const updatedUser = {
		...mockUser,
		firstName,
		lastName,
		email,
		phone: phone || mockUser.phone,
		businessName: businessName || mockUser.businessName,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	res.json({
		success: true,
		data: updatedUser,
		message: "Profile updated successfully"
	});
};
/**
* PUT /api/users/settings
* Update user preferences
*/
var updateUserSettings = (req, res) => {
	const userId = req.userId;
	const { currency, theme, notifications } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const userSettings = {
		currency: currency || "USD",
		theme: theme || "light",
		notifications: {
			email: notifications?.email !== false,
			transactionAlerts: notifications?.transactionAlerts !== false,
			weeklyReport: notifications?.weeklyReport !== false
		}
	};
	res.json({
		success: true,
		data: userSettings,
		message: "Settings updated successfully"
	});
};
/**
* DELETE /api/users/account
* Delete user account (requires confirmation)
*/
var deleteUserAccount = (req, res) => {
	const userId = req.userId;
	const { password } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!password) return res.status(400).json({
		success: false,
		error: "Password required for account deletion"
	});
	res.json({
		success: true,
		message: "Account deleted successfully"
	});
};
//#endregion
//#region server/routes/wallet.ts
var mockWallets = [
	{
		id: "wallet-1",
		userId: "user-123",
		name: "Main Wallet",
		balance: 12450.75,
		currency: "USD",
		type: "primary",
		createdAt: "2023-01-15T10:00:00Z"
	},
	{
		id: "wallet-2",
		userId: "user-123",
		name: "Savings",
		balance: 8500,
		currency: "USD",
		type: "savings",
		createdAt: "2023-02-20T10:00:00Z"
	},
	{
		id: "wallet-3",
		userId: "user-123",
		name: "Business Account",
		balance: 3629.75,
		currency: "USD",
		type: "business",
		createdAt: "2023-03-10T10:00:00Z"
	}
];
/**
* GET /api/wallets
* List all user wallets
*/
var listWallets = (req, res) => {
	const userId = req.userId;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const userWallets = mockWallets.filter((w) => w.userId === userId);
	const totalBalance = userWallets.reduce((sum, w) => sum + w.balance, 0);
	res.json({
		success: true,
		data: {
			wallets: userWallets,
			totalBalance,
			count: userWallets.length
		}
	});
};
/**
* GET /api/wallets/:walletId
* Get specific wallet details
*/
var getWallet = (req, res) => {
	const userId = req.userId;
	const { walletId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const wallet = mockWallets.find((w) => w.id === walletId && w.userId === userId);
	if (!wallet) return res.status(404).json({
		success: false,
		error: "Wallet not found"
	});
	res.json({
		success: true,
		data: wallet
	});
};
/**
* POST /api/wallets
* Create new wallet
*/
var createWallet = (req, res) => {
	const userId = req.userId;
	const { name, type, currency } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!name || !type) return res.status(400).json({
		success: false,
		error: "Wallet name and type are required"
	});
	const newWallet = {
		id: `wallet-${Date.now()}`,
		userId,
		name,
		balance: 0,
		currency: currency || "USD",
		type: type || "general",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	mockWallets.push(newWallet);
	res.status(201).json({
		success: true,
		data: newWallet,
		message: "Wallet created successfully"
	});
};
/**
* PUT /api/wallets/:walletId
* Update wallet
*/
var updateWallet = (req, res) => {
	const userId = req.userId;
	const { walletId } = req.params;
	const { name } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const wallet = mockWallets.find((w) => w.id === walletId && w.userId === userId);
	if (!wallet) return res.status(404).json({
		success: false,
		error: "Wallet not found"
	});
	if (name) wallet.name = name;
	res.json({
		success: true,
		data: wallet,
		message: "Wallet updated successfully"
	});
};
/**
* DELETE /api/wallets/:walletId
* Delete wallet
*/
var deleteWallet = (req, res) => {
	const userId = req.userId;
	const { walletId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const walletIndex = mockWallets.findIndex((w) => w.id === walletId && w.userId === userId);
	if (walletIndex === -1) return res.status(404).json({
		success: false,
		error: "Wallet not found"
	});
	const deletedWallet = mockWallets.splice(walletIndex, 1);
	res.json({
		success: true,
		data: deletedWallet[0],
		message: "Wallet deleted successfully"
	});
};
/**
* POST /api/wallets/:walletId/transfer
* Transfer funds between wallets
*/
var transferFunds = (req, res) => {
	const userId = req.userId;
	const { walletId } = req.params;
	const { toWalletId, amount, description } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!toWalletId || !amount || amount <= 0) return res.status(400).json({
		success: false,
		error: "Valid target wallet and amount are required"
	});
	const fromWallet = mockWallets.find((w) => w.id === walletId && w.userId === userId);
	const toWallet = mockWallets.find((w) => w.id === toWalletId && w.userId === userId);
	if (!fromWallet || !toWallet) return res.status(404).json({
		success: false,
		error: "One or both wallets not found"
	});
	if (fromWallet.balance < amount) return res.status(400).json({
		success: false,
		error: "Insufficient balance"
	});
	fromWallet.balance -= amount;
	toWallet.balance += amount;
	const transfer = {
		id: `transfer-${Date.now()}`,
		fromWalletId: walletId,
		toWalletId,
		amount,
		description: description || "Wallet transfer",
		status: "completed",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	res.json({
		success: true,
		data: transfer,
		message: "Transfer completed successfully"
	});
};
//#endregion
//#region server/routes/transactions.ts
var mockTransactions = [
	{
		id: "tx-1",
		userId: "user-123",
		walletId: "wallet-1",
		description: "Stripe Payment",
		category: "Income",
		amount: 1200,
		type: "credit",
		date: "2024-01-15",
		status: "completed",
		metadata: { paymentId: "stripe-123" }
	},
	{
		id: "tx-2",
		userId: "user-123",
		walletId: "wallet-1",
		description: "Office Supplies",
		category: "Business",
		amount: 245.5,
		type: "debit",
		date: "2024-01-14",
		status: "completed",
		metadata: {}
	},
	{
		id: "tx-3",
		userId: "user-123",
		walletId: "wallet-1",
		description: "Client Invoice",
		category: "Income",
		amount: 3500,
		type: "credit",
		date: "2024-01-13",
		status: "completed",
		metadata: {}
	},
	{
		id: "tx-4",
		userId: "user-123",
		walletId: "wallet-1",
		description: "Software License",
		category: "Software",
		amount: 99.99,
		type: "debit",
		date: "2024-01-12",
		status: "completed",
		metadata: {}
	},
	{
		id: "tx-5",
		userId: "user-123",
		walletId: "wallet-1",
		description: "Freelance Project",
		category: "Income",
		amount: 2100,
		type: "credit",
		date: "2024-01-11",
		status: "completed",
		metadata: {}
	}
];
/**
* GET /api/transactions
* Get transaction history with filters
*/
var getTransactions = (req, res) => {
	const userId = req.userId;
	const { walletId, type, category, startDate, endDate, limit = "50" } = req.query;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	let filtered = mockTransactions.filter((t) => t.userId === userId);
	if (walletId) filtered = filtered.filter((t) => t.walletId === walletId);
	if (type) filtered = filtered.filter((t) => t.type === type);
	if (category) filtered = filtered.filter((t) => t.category === category);
	filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	const limitNum = parseInt(limit);
	const transactions = filtered.slice(0, limitNum);
	const summary = {
		totalTransactions: filtered.length,
		totalIncome: filtered.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0),
		totalExpenses: filtered.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)
	};
	res.json({
		success: true,
		data: {
			transactions,
			summary,
			count: transactions.length
		}
	});
};
/**
* GET /api/transactions/:transactionId
* Get specific transaction details
*/
var getTransaction = (req, res) => {
	const userId = req.userId;
	const { transactionId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const transaction = mockTransactions.find((t) => t.id === transactionId && t.userId === userId);
	if (!transaction) return res.status(404).json({
		success: false,
		error: "Transaction not found"
	});
	res.json({
		success: true,
		data: transaction
	});
};
/**
* POST /api/transactions
* Create new transaction (mainly for testing)
*/
var createTransaction = (req, res) => {
	const userId = req.userId;
	const { walletId, description, category, amount, type } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!walletId || !description || !amount || !type) return res.status(400).json({
		success: false,
		error: "Missing required fields"
	});
	const newTransaction = {
		id: `tx-${Date.now()}`,
		userId,
		walletId,
		description,
		category: category || "Other",
		amount,
		type,
		date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		status: "completed",
		metadata: {}
	};
	mockTransactions.push(newTransaction);
	res.status(201).json({
		success: true,
		data: newTransaction,
		message: "Transaction created successfully"
	});
};
/**
* POST /api/transactions/export
* Export transactions as CSV
*/
var exportTransactions = (req, res) => {
	const userId = req.userId;
	const { format = "csv", walletId } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	let filtered = mockTransactions.filter((t) => t.userId === userId);
	if (walletId) filtered = filtered.filter((t) => t.walletId === walletId);
	if (format === "csv") {
		const csvContent = [[
			"Date",
			"Description",
			"Category",
			"Type",
			"Amount",
			"Status"
		].join(","), ...filtered.map((t) => [
			t.date,
			`"${t.description}"`,
			t.category,
			t.type,
			t.amount,
			t.status
		].join(","))].join("\n");
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
		res.send(csvContent);
	} else if (format === "json") {
		res.setHeader("Content-Type", "application/json");
		res.setHeader("Content-Disposition", "attachment; filename=transactions.json");
		res.json(filtered);
	} else res.status(400).json({
		success: false,
		error: "Unsupported export format"
	});
};
/**
* GET /api/transactions/categories
* Get available transaction categories
*/
var getCategories = (req, res) => {
	const categories = [
		"Income",
		"Salary",
		"Freelance",
		"Investment",
		"Other Income",
		"Business",
		"Software",
		"Utilities",
		"Transport",
		"Groceries",
		"Entertainment",
		"Healthcare",
		"Education",
		"Other"
	];
	res.json({
		success: true,
		data: {
			categories,
			count: categories.length
		}
	});
};
//#endregion
//#region server/routes/cards.ts
var mockPaymentMethods = [
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
		createdAt: "2023-01-15T10:00:00Z"
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
		createdAt: "2023-02-20T10:00:00Z"
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
		createdAt: "2023-03-10T10:00:00Z"
	}
];
/**
* GET /api/payment-methods
* List all payment methods
*/
var listPaymentMethods = (req, res) => {
	const userId = req.userId;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const methods = mockPaymentMethods.filter((m) => m.userId === userId);
	res.json({
		success: true,
		data: {
			paymentMethods: methods,
			count: methods.length
		}
	});
};
/**
* GET /api/payment-methods/:methodId
* Get specific payment method
*/
var getPaymentMethod = (req, res) => {
	const userId = req.userId;
	const { methodId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const method = mockPaymentMethods.find((m) => m.id === methodId && m.userId === userId);
	if (!method) return res.status(404).json({
		success: false,
		error: "Payment method not found"
	});
	res.json({
		success: true,
		data: method
	});
};
/**
* POST /api/payment-methods
* Add new payment method
*/
var addPaymentMethod = (req, res) => {
	const userId = req.userId;
	const { type, brand, name, last4, expiryDate, accountType } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!type || !name || !last4) return res.status(400).json({
		success: false,
		error: "Type, name, and last 4 digits are required"
	});
	const newMethod = {
		id: `pm-${Date.now()}`,
		userId,
		type,
		brand: brand || type,
		name,
		last4,
		expiryDate: expiryDate || void 0,
		accountType: accountType || void 0,
		isDefault: false,
		isVerified: false,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	mockPaymentMethods.push(newMethod);
	res.status(201).json({
		success: true,
		data: newMethod,
		message: "Payment method added. Please verify to use for transactions."
	});
};
/**
* PUT /api/payment-methods/:methodId
* Update payment method
*/
var updatePaymentMethod = (req, res) => {
	const userId = req.userId;
	const { methodId } = req.params;
	const { name, isDefault } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const method = mockPaymentMethods.find((m) => m.id === methodId && m.userId === userId);
	if (!method) return res.status(404).json({
		success: false,
		error: "Payment method not found"
	});
	if (name) method.name = name;
	if (isDefault === true) {
		mockPaymentMethods.forEach((m) => {
			if (m.userId === userId && m.id !== methodId) m.isDefault = false;
		});
		method.isDefault = true;
	}
	res.json({
		success: true,
		data: method,
		message: "Payment method updated successfully"
	});
};
/**
* POST /api/payment-methods/:methodId/verify
* Verify payment method
*/
var verifyPaymentMethod = (req, res) => {
	const userId = req.userId;
	const { methodId } = req.params;
	const { verificationCode } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const method = mockPaymentMethods.find((m) => m.id === methodId && m.userId === userId);
	if (!method) return res.status(404).json({
		success: false,
		error: "Payment method not found"
	});
	if (!verificationCode) return res.status(400).json({
		success: false,
		error: "Verification code is required"
	});
	method.isVerified = true;
	res.json({
		success: true,
		data: method,
		message: "Payment method verified successfully"
	});
};
/**
* DELETE /api/payment-methods/:methodId
* Remove payment method
*/
var deletePaymentMethod = (req, res) => {
	const userId = req.userId;
	const { methodId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const methodIndex = mockPaymentMethods.findIndex((m) => m.id === methodId && m.userId === userId);
	if (methodIndex === -1) return res.status(404).json({
		success: false,
		error: "Payment method not found"
	});
	const deletedMethod = mockPaymentMethods.splice(methodIndex, 1);
	res.json({
		success: true,
		data: deletedMethod[0],
		message: "Payment method deleted successfully"
	});
};
//#endregion
//#region server/routes/payments.ts
var mockPayments = [];
/**
* POST /api/payments/process
* Process payment via Stripe
*/
var processPayment = (req, res) => {
	const userId = req.userId;
	const { amount, currency, paymentMethodId, description } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!amount || !paymentMethodId) return res.status(400).json({
		success: false,
		error: "Amount and payment method are required"
	});
	if (amount <= 0) return res.status(400).json({
		success: false,
		error: "Amount must be greater than 0"
	});
	const payment = {
		id: `pay-${Date.now()}`,
		userId,
		amount,
		currency: currency || "USD",
		paymentMethodId,
		description: description || "Payment",
		status: "processing",
		stripePaymentIntentId: `pi_${Date.now()}`,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	mockPayments.push(payment);
	res.status(201).json({
		success: true,
		data: payment,
		message: "Payment processing started"
	});
};
/**
* GET /api/payments/:paymentId
* Get payment status
*/
var getPaymentStatus = (req, res) => {
	const userId = req.userId;
	const { paymentId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const payment = mockPayments.find((p) => p.id === paymentId && p.userId === userId);
	if (!payment) return res.status(404).json({
		success: false,
		error: "Payment not found"
	});
	res.json({
		success: true,
		data: payment
	});
};
/**
* POST /api/payments/webhook
* Handle Stripe webhook events
* This endpoint should NOT require authentication
*/
var handleStripeWebhook = (req, res) => {
	const { type, data } = req.body;
	switch (type) {
		case "payment_intent.succeeded":
			console.log("Payment succeeded:", data.object.id);
			break;
		case "payment_intent.payment_failed":
			console.log("Payment failed:", data.object.id);
			break;
		case "charge.refunded":
			console.log("Charge refunded:", data.object.id);
			break;
		default: console.log("Unhandled event type:", type);
	}
	res.json({ received: true });
};
/**
* POST /api/payments/:paymentId/refund
* Refund a payment
*/
var refundPayment = (req, res) => {
	const userId = req.userId;
	const { paymentId } = req.params;
	const { reason } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const payment = mockPayments.find((p) => p.id === paymentId && p.userId === userId);
	if (!payment) return res.status(404).json({
		success: false,
		error: "Payment not found"
	});
	if (payment.status !== "succeeded") return res.status(400).json({
		success: false,
		error: "Only succeeded payments can be refunded"
	});
	payment.status = "refunded";
	payment.refundReason = reason || "Customer requested";
	payment.refundedAt = (/* @__PURE__ */ new Date()).toISOString();
	res.json({
		success: true,
		data: payment,
		message: "Payment refunded successfully"
	});
};
/**
* GET /api/payments
* List all payments for user
*/
var listPayments = (req, res) => {
	const userId = req.userId;
	const { status, limit = "50" } = req.query;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	let payments = mockPayments.filter((p) => p.userId === userId);
	if (status) payments = payments.filter((p) => p.status === status);
	payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	const limitNum = parseInt(limit);
	payments = payments.slice(0, limitNum);
	res.json({
		success: true,
		data: {
			payments,
			count: payments.length
		}
	});
};
//#endregion
//#region server/routes/invoices.ts
var mockInvoices = [{
	id: "inv-1",
	userId: "user-123",
	invoiceNumber: "INV-001",
	clientName: "Acme Corporation",
	clientEmail: "billing@acme.com",
	clientAddress: "123 Business St, City, State 12345",
	amount: 2500,
	tax: 200,
	total: 2700,
	currency: "USD",
	status: "sent",
	issueDate: "2024-01-10",
	dueDate: "2024-02-10",
	description: "Professional services rendered",
	lineItems: [{
		description: "Consulting Services",
		quantity: 20,
		unitPrice: 100,
		amount: 2e3
	}, {
		description: "Development Hours",
		quantity: 10,
		unitPrice: 50,
		amount: 500
	}],
	notes: "Thank you for your business!",
	paymentMethod: null,
	paymentDate: null,
	stripeLink: null,
	createdAt: "2024-01-10T10:00:00Z",
	updatedAt: "2024-01-10T10:00:00Z"
}];
/**
* GET /api/invoices
* List all invoices for the user
*/
var listInvoices = (req, res) => {
	const userId = req.userId;
	const { status } = req.query;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	let invoices = mockInvoices.filter((inv) => inv.userId === userId);
	if (status) invoices = invoices.filter((inv) => inv.status === status);
	invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	res.json({
		success: true,
		data: {
			invoices,
			count: invoices.length
		}
	});
};
/**
* GET /api/invoices/:invoiceId
* Get specific invoice details
*/
var getInvoice = (req, res) => {
	const userId = req.userId;
	const { invoiceId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const invoice = mockInvoices.find((inv) => inv.id === invoiceId && inv.userId === userId);
	if (!invoice) return res.status(404).json({
		success: false,
		error: "Invoice not found"
	});
	res.json({
		success: true,
		data: invoice
	});
};
/**
* POST /api/invoices
* Create new invoice
*/
var createInvoice = (req, res) => {
	const userId = req.userId;
	const { clientName, clientEmail, clientAddress, lineItems, dueDate, notes, description } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	if (!clientName || !clientEmail || !Array.isArray(lineItems) || lineItems.length === 0) return res.status(400).json({
		success: false,
		error: "Client name, email, and line items are required"
	});
	let amount = 0;
	lineItems.forEach((item) => {
		amount += (item.quantity || 1) * (item.unitPrice || 0);
	});
	const tax = Math.round(amount * .08 * 100) / 100;
	const total = amount + tax;
	const invoiceNumber = `INV-${String(mockInvoices.length + 1).padStart(3, "0")}`;
	const newInvoice = {
		id: `inv-${Date.now()}`,
		userId,
		invoiceNumber,
		clientName,
		clientEmail,
		clientAddress: clientAddress || "",
		amount,
		tax,
		total,
		currency: "USD",
		status: "draft",
		issueDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		dueDate: dueDate || new Date(Date.now() + 720 * 60 * 60 * 1e3).toISOString().split("T")[0],
		description: description || "Invoice for professional services",
		lineItems,
		notes: notes || "",
		paymentMethod: null,
		paymentDate: null,
		stripeLink: null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	mockInvoices.push(newInvoice);
	res.status(201).json({
		success: true,
		data: newInvoice,
		message: "Invoice created successfully"
	});
};
/**
* PUT /api/invoices/:invoiceId
* Update invoice
*/
var updateInvoice = (req, res) => {
	const userId = req.userId;
	const { invoiceId } = req.params;
	const { clientName, clientEmail, dueDate, notes, lineItems } = req.body;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const invoice = mockInvoices.find((inv) => inv.id === invoiceId && inv.userId === userId);
	if (!invoice) return res.status(404).json({
		success: false,
		error: "Invoice not found"
	});
	if (invoice.status !== "draft") return res.status(400).json({
		success: false,
		error: "Can only edit draft invoices"
	});
	if (clientName) invoice.clientName = clientName;
	if (clientEmail) invoice.clientEmail = clientEmail;
	if (dueDate) invoice.dueDate = dueDate;
	if (notes) invoice.notes = notes;
	if (lineItems && Array.isArray(lineItems)) {
		invoice.lineItems = lineItems;
		let amount = 0;
		lineItems.forEach((item) => {
			amount += (item.quantity || 1) * (item.unitPrice || 0);
		});
		invoice.amount = amount;
		invoice.tax = Math.round(amount * .08 * 100) / 100;
		invoice.total = amount + invoice.tax;
	}
	invoice.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	res.json({
		success: true,
		data: invoice,
		message: "Invoice updated successfully"
	});
};
/**
* POST /api/invoices/:invoiceId/send
* Send invoice to client (mark as sent and queue email)
*/
var sendInvoice = (req, res) => {
	const userId = req.userId;
	const { invoiceId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const invoice = mockInvoices.find((inv) => inv.id === invoiceId && inv.userId === userId);
	if (!invoice) return res.status(404).json({
		success: false,
		error: "Invoice not found"
	});
	if (invoice.status !== "draft") return res.status(400).json({
		success: false,
		error: "Can only send draft invoices"
	});
	invoice.status = "sent";
	invoice.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	res.json({
		success: true,
		data: invoice,
		message: "Invoice sent to client successfully"
	});
};
/**
* DELETE /api/invoices/:invoiceId
* Delete invoice (only draft invoices)
*/
var deleteInvoice = (req, res) => {
	const userId = req.userId;
	const { invoiceId } = req.params;
	if (!userId) return res.status(401).json({
		success: false,
		error: "Unauthorized"
	});
	const invoiceIndex = mockInvoices.findIndex((inv) => inv.id === invoiceId && inv.userId === userId);
	if (invoiceIndex === -1) return res.status(404).json({
		success: false,
		error: "Invoice not found"
	});
	if (mockInvoices[invoiceIndex].status !== "draft") return res.status(400).json({
		success: false,
		error: "Can only delete draft invoices"
	});
	mockInvoices.splice(invoiceIndex, 1);
	res.json({
		success: true,
		message: "Invoice deleted successfully"
	});
};
/**
* GET /api/invoices/public/:invoiceId
* Get invoice by public link (no auth required)
* Used for customer payment page
*/
var getInvoicePublic = (req, res) => {
	const { invoiceId } = req.params;
	const invoice = mockInvoices.find((inv) => inv.id === invoiceId);
	if (!invoice) return res.status(404).json({
		success: false,
		error: "Invoice not found"
	});
	if (![
		"sent",
		"paid",
		"partially_paid"
	].includes(invoice.status)) return res.status(403).json({
		success: false,
		error: "This invoice is not yet available for payment"
	});
	res.json({
		success: true,
		data: invoice
	});
};
/**
* POST /api/invoices/:invoiceId/record-payment
* Record a payment for an invoice
*/
var recordPayment = (req, res) => {
	const { invoiceId } = req.params;
	const { amount, paymentMethod, stripePaymentIntentId } = req.body;
	const invoice = mockInvoices.find((inv) => inv.id === invoiceId);
	if (!invoice) return res.status(404).json({
		success: false,
		error: "Invoice not found"
	});
	if (!amount || amount <= 0) return res.status(400).json({
		success: false,
		error: "Valid payment amount is required"
	});
	if (amount > invoice.total) return res.status(400).json({
		success: false,
		error: "Payment amount exceeds invoice total"
	});
	invoice.status = amount >= invoice.total ? "paid" : "partially_paid";
	invoice.paymentDate = (/* @__PURE__ */ new Date()).toISOString();
	invoice.paymentMethod = paymentMethod || "stripe";
	invoice.stripePaymentIntentId = stripePaymentIntentId;
	invoice.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	res.json({
		success: true,
		data: invoice,
		message: "Payment recorded successfully. Receipt sent to client."
	});
};
//#endregion
//#region server/index.ts
function createServer() {
	const app = express();
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.get("/api/ping", (_req, res) => {
		const ping = process.env.PING_MESSAGE ?? "ping";
		res.json({ message: ping });
	});
	app.get("/api/demo", handleDemo);
	app.post("/api/auth/signup", signup);
	app.post("/api/auth/login", login);
	app.post("/api/auth/refresh", authMiddleware, refreshToken);
	app.post("/api/auth/logout", authMiddleware, logout);
	app.post("/api/auth/forgot-password", forgotPassword);
	app.post("/api/auth/reset-password", resetPassword);
	app.get("/api/users/profile", authMiddleware, getUserProfile);
	app.put("/api/users/profile", authMiddleware, updateUserProfile);
	app.put("/api/users/settings", authMiddleware, updateUserSettings);
	app.delete("/api/users/account", authMiddleware, deleteUserAccount);
	app.get("/api/wallets", authMiddleware, listWallets);
	app.post("/api/wallets", authMiddleware, createWallet);
	app.get("/api/wallets/:walletId", authMiddleware, getWallet);
	app.put("/api/wallets/:walletId", authMiddleware, updateWallet);
	app.delete("/api/wallets/:walletId", authMiddleware, deleteWallet);
	app.post("/api/wallets/:walletId/transfer", authMiddleware, transferFunds);
	app.get("/api/transactions", authMiddleware, getTransactions);
	app.get("/api/transactions/categories", authMiddleware, getCategories);
	app.post("/api/transactions", authMiddleware, createTransaction);
	app.get("/api/transactions/:transactionId", authMiddleware, getTransaction);
	app.post("/api/transactions/export", authMiddleware, exportTransactions);
	app.get("/api/payment-methods", authMiddleware, listPaymentMethods);
	app.post("/api/payment-methods", authMiddleware, addPaymentMethod);
	app.get("/api/payment-methods/:methodId", authMiddleware, getPaymentMethod);
	app.put("/api/payment-methods/:methodId", authMiddleware, updatePaymentMethod);
	app.post("/api/payment-methods/:methodId/verify", authMiddleware, verifyPaymentMethod);
	app.delete("/api/payment-methods/:methodId", authMiddleware, deletePaymentMethod);
	app.get("/api/payments", authMiddleware, listPayments);
	app.post("/api/payments/process", authMiddleware, processPayment);
	app.get("/api/payments/:paymentId", authMiddleware, getPaymentStatus);
	app.post("/api/payments/:paymentId/refund", authMiddleware, refundPayment);
	app.post("/api/payments/webhook", handleStripeWebhook);
	app.get("/api/invoices", authMiddleware, listInvoices);
	app.post("/api/invoices", authMiddleware, createInvoice);
	app.get("/api/invoices/:invoiceId", authMiddleware, getInvoice);
	app.put("/api/invoices/:invoiceId", authMiddleware, updateInvoice);
	app.post("/api/invoices/:invoiceId/send", authMiddleware, sendInvoice);
	app.delete("/api/invoices/:invoiceId", authMiddleware, deleteInvoice);
	app.post("/api/invoices/:invoiceId/payment", recordPayment);
	app.get("/api/invoices/public/:invoiceId", getInvoicePublic);
	app.use(errorHandler);
	return app;
}
//#endregion
//#region server/node-build.ts
var app = createServer();
var port = process.env.PORT || 3e3;
var __dirname = import.meta.dirname;
var distPath = path.join(__dirname, "../spa");
app.use(express$1.static(distPath));
app.get("*", (req, res) => {
	if (req.path.startsWith("/api/") || req.path.startsWith("/health")) return res.status(404).json({ error: "API endpoint not found" });
	res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
	console.log(`🚀 Fusion Starter server running on port ${port}`);
	console.log(`📱 Frontend: http://localhost:${port}`);
	console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
	console.log("🛑 Received SIGTERM, shutting down gracefully");
	process.exit(0);
});
process.on("SIGINT", () => {
	console.log("🛑 Received SIGINT, shutting down gracefully");
	process.exit(0);
});
//#endregion
export {};

//# sourceMappingURL=node-build.mjs.map