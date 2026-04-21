import { RequestHandler } from "express";

// Mock wallet data
const mockWallets = [
  {
    id: "wallet-1",
    userId: "user-123",
    name: "Main Wallet",
    balance: 12450.75,
    currency: "USD",
    type: "primary",
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "wallet-2",
    userId: "user-123",
    name: "Savings",
    balance: 8500.0,
    currency: "USD",
    type: "savings",
    createdAt: "2023-02-20T10:00:00Z",
  },
  {
    id: "wallet-3",
    userId: "user-123",
    name: "Business Account",
    balance: 3629.75,
    currency: "USD",
    type: "business",
    createdAt: "2023-03-10T10:00:00Z",
  },
];

/**
 * GET /api/wallets
 * List all user wallets
 */
export const listWallets: RequestHandler = (req, res) => {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  // Filter wallets for the user
  const userWallets = mockWallets.filter((w) => w.userId === userId);
  const totalBalance = userWallets.reduce((sum, w) => sum + w.balance, 0);

  res.json({
    success: true,
    data: {
      wallets: userWallets,
      totalBalance,
      count: userWallets.length,
    },
  });
};

/**
 * GET /api/wallets/:walletId
 * Get specific wallet details
 */
export const getWallet: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { walletId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const wallet = mockWallets.find(
    (w) => w.id === walletId && w.userId === userId
  );

  if (!wallet) {
    return res.status(404).json({
      success: false,
      error: "Wallet not found",
    });
  }

  res.json({
    success: true,
    data: wallet,
  });
};

/**
 * POST /api/wallets
 * Create new wallet
 */
export const createWallet: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { name, type, currency } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  // Validate input
  if (!name || !type) {
    return res.status(400).json({
      success: false,
      error: "Wallet name and type are required",
    });
  }

  // In production, create in database
  const newWallet = {
    id: `wallet-${Date.now()}`,
    userId,
    name,
    balance: 0,
    currency: currency || "USD",
    type: type || "general",
    createdAt: new Date().toISOString(),
  };

  mockWallets.push(newWallet);

  res.status(201).json({
    success: true,
    data: newWallet,
    message: "Wallet created successfully",
  });
};

/**
 * PUT /api/wallets/:walletId
 * Update wallet
 */
export const updateWallet: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { walletId } = req.params;
  const { name } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const wallet = mockWallets.find(
    (w) => w.id === walletId && w.userId === userId
  );

  if (!wallet) {
    return res.status(404).json({
      success: false,
      error: "Wallet not found",
    });
  }

  if (name) {
    wallet.name = name;
  }

  res.json({
    success: true,
    data: wallet,
    message: "Wallet updated successfully",
  });
};

/**
 * DELETE /api/wallets/:walletId
 * Delete wallet
 */
export const deleteWallet: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { walletId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const walletIndex = mockWallets.findIndex(
    (w) => w.id === walletId && w.userId === userId
  );

  if (walletIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Wallet not found",
    });
  }

  const deletedWallet = mockWallets.splice(walletIndex, 1);

  res.json({
    success: true,
    data: deletedWallet[0],
    message: "Wallet deleted successfully",
  });
};

/**
 * POST /api/wallets/:walletId/transfer
 * Transfer funds between wallets
 */
export const transferFunds: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { walletId } = req.params;
  const { toWalletId, amount, description } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (!toWalletId || !amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      error: "Valid target wallet and amount are required",
    });
  }

  const fromWallet = mockWallets.find(
    (w) => w.id === walletId && w.userId === userId
  );
  const toWallet = mockWallets.find(
    (w) => w.id === toWalletId && w.userId === userId
  );

  if (!fromWallet || !toWallet) {
    return res.status(404).json({
      success: false,
      error: "One or both wallets not found",
    });
  }

  if (fromWallet.balance < amount) {
    return res.status(400).json({
      success: false,
      error: "Insufficient balance",
    });
  }

  // Perform transfer
  fromWallet.balance -= amount;
  toWallet.balance += amount;

  const transfer = {
    id: `transfer-${Date.now()}`,
    fromWalletId: walletId,
    toWalletId,
    amount,
    description: description || "Wallet transfer",
    status: "completed",
    createdAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: transfer,
    message: "Transfer completed successfully",
  });
};
