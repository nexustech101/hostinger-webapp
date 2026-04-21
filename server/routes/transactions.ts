import { RequestHandler } from "express";

// Mock transaction data
const mockTransactions = [
  {
    id: "tx-1",
    userId: "user-123",
    walletId: "wallet-1",
    description: "Stripe Payment",
    category: "Income",
    amount: 1200.0,
    type: "credit",
    date: "2024-01-15",
    status: "completed",
    metadata: { paymentId: "stripe-123" },
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
    metadata: {},
  },
  {
    id: "tx-3",
    userId: "user-123",
    walletId: "wallet-1",
    description: "Client Invoice",
    category: "Income",
    amount: 3500.0,
    type: "credit",
    date: "2024-01-13",
    status: "completed",
    metadata: {},
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
    metadata: {},
  },
  {
    id: "tx-5",
    userId: "user-123",
    walletId: "wallet-1",
    description: "Freelance Project",
    category: "Income",
    amount: 2100.0,
    type: "credit",
    date: "2024-01-11",
    status: "completed",
    metadata: {},
  },
];

/**
 * GET /api/transactions
 * Get transaction history with filters
 */
export const getTransactions: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { walletId, type, category, startDate, endDate, limit = "50" } =
    req.query;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  let filtered = mockTransactions.filter((t) => t.userId === userId);

  // Apply filters
  if (walletId) {
    filtered = filtered.filter((t) => t.walletId === walletId);
  }
  if (type) {
    filtered = filtered.filter((t) => t.type === type);
  }
  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }

  // Sort by date (newest first)
  filtered.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Limit results
  const limitNum = parseInt(limit as string);
  const transactions = filtered.slice(0, limitNum);

  // Calculate summary
  const summary = {
    totalTransactions: filtered.length,
    totalIncome: filtered
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: filtered
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  res.json({
    success: true,
    data: {
      transactions,
      summary,
      count: transactions.length,
    },
  });
};

/**
 * GET /api/transactions/:transactionId
 * Get specific transaction details
 */
export const getTransaction: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { transactionId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const transaction = mockTransactions.find(
    (t) => t.id === transactionId && t.userId === userId
  );

  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: "Transaction not found",
    });
  }

  res.json({
    success: true,
    data: transaction,
  });
};

/**
 * POST /api/transactions
 * Create new transaction (mainly for testing)
 */
export const createTransaction: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { walletId, description, category, amount, type } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (!walletId || !description || !amount || !type) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  const newTransaction = {
    id: `tx-${Date.now()}`,
    userId,
    walletId,
    description,
    category: category || "Other",
    amount,
    type,
    date: new Date().toISOString().split("T")[0],
    status: "completed",
    metadata: {},
  };

  mockTransactions.push(newTransaction);

  res.status(201).json({
    success: true,
    data: newTransaction,
    message: "Transaction created successfully",
  });
};

/**
 * POST /api/transactions/export
 * Export transactions as CSV
 */
export const exportTransactions: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { format = "csv", walletId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  let filtered = mockTransactions.filter((t) => t.userId === userId);

  if (walletId) {
    filtered = filtered.filter((t) => t.walletId === walletId);
  }

  if (format === "csv") {
    // Generate CSV
    const headers = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filtered.map((t) =>
        [
          t.date,
          `"${t.description}"`,
          t.category,
          t.type,
          t.amount,
          t.status,
        ].join(",")
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.csv"
    );
    res.send(csvContent);
  } else if (format === "json") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.json"
    );
    res.json(filtered);
  } else {
    res.status(400).json({
      success: false,
      error: "Unsupported export format",
    });
  }
};

/**
 * GET /api/transactions/categories
 * Get available transaction categories
 */
export const getCategories: RequestHandler = (req, res) => {
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
    "Other",
  ];

  res.json({
    success: true,
    data: {
      categories,
      count: categories.length,
    },
  });
};
