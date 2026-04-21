import { RequestHandler } from "express";

// Mock invoice data
const mockInvoices: any[] = [
  {
    id: "inv-1",
    userId: "user-123",
    invoiceNumber: "INV-001",
    clientName: "Acme Corporation",
    clientEmail: "billing@acme.com",
    clientAddress: "123 Business St, City, State 12345",
    amount: 2500.0,
    tax: 200.0,
    total: 2700.0,
    currency: "USD",
    status: "sent",
    issueDate: "2024-01-10",
    dueDate: "2024-02-10",
    description: "Professional services rendered",
    lineItems: [
      { description: "Consulting Services", quantity: 20, unitPrice: 100, amount: 2000 },
      { description: "Development Hours", quantity: 10, unitPrice: 50, amount: 500 },
    ],
    notes: "Thank you for your business!",
    paymentMethod: null,
    paymentDate: null,
    stripeLink: null,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
];

/**
 * GET /api/invoices
 * List all invoices for the user
 */
export const listInvoices: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { status } = req.query;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  let invoices = mockInvoices.filter((inv) => inv.userId === userId);

  if (status) {
    invoices = invoices.filter((inv) => inv.status === status);
  }

  // Sort by date (newest first)
  invoices.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json({
    success: true,
    data: {
      invoices,
      count: invoices.length,
    },
  });
};

/**
 * GET /api/invoices/:invoiceId
 * Get specific invoice details
 */
export const getInvoice: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { invoiceId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const invoice = mockInvoices.find(
    (inv) => inv.id === invoiceId && inv.userId === userId
  );

  if (!invoice) {
    return res.status(404).json({
      success: false,
      error: "Invoice not found",
    });
  }

  res.json({
    success: true,
    data: invoice,
  });
};

/**
 * POST /api/invoices
 * Create new invoice
 */
export const createInvoice: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const {
    clientName,
    clientEmail,
    clientAddress,
    lineItems,
    dueDate,
    notes,
    description,
  } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  // Validate input
  if (!clientName || !clientEmail || !Array.isArray(lineItems) || lineItems.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Client name, email, and line items are required",
    });
  }

  // Calculate totals
  let amount = 0;
  lineItems.forEach((item: any) => {
    amount += (item.quantity || 1) * (item.unitPrice || 0);
  });

  const tax = Math.round(amount * 0.08 * 100) / 100; // 8% default tax
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
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    description: description || "Invoice for professional services",
    lineItems,
    notes: notes || "",
    paymentMethod: null,
    paymentDate: null,
    stripeLink: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockInvoices.push(newInvoice);

  res.status(201).json({
    success: true,
    data: newInvoice,
    message: "Invoice created successfully",
  });
};

/**
 * PUT /api/invoices/:invoiceId
 * Update invoice
 */
export const updateInvoice: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { invoiceId } = req.params;
  const { clientName, clientEmail, dueDate, notes, lineItems } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const invoice = mockInvoices.find(
    (inv) => inv.id === invoiceId && inv.userId === userId
  );

  if (!invoice) {
    return res.status(404).json({
      success: false,
      error: "Invoice not found",
    });
  }

  // Only allow editing draft invoices
  if (invoice.status !== "draft") {
    return res.status(400).json({
      success: false,
      error: "Can only edit draft invoices",
    });
  }

  if (clientName) invoice.clientName = clientName;
  if (clientEmail) invoice.clientEmail = clientEmail;
  if (dueDate) invoice.dueDate = dueDate;
  if (notes) invoice.notes = notes;

  if (lineItems && Array.isArray(lineItems)) {
    invoice.lineItems = lineItems;
    // Recalculate totals
    let amount = 0;
    lineItems.forEach((item: any) => {
      amount += (item.quantity || 1) * (item.unitPrice || 0);
    });
    invoice.amount = amount;
    invoice.tax = Math.round(amount * 0.08 * 100) / 100;
    invoice.total = amount + invoice.tax;
  }

  invoice.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: invoice,
    message: "Invoice updated successfully",
  });
};

/**
 * POST /api/invoices/:invoiceId/send
 * Send invoice to client (mark as sent and queue email)
 */
export const sendInvoice: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { invoiceId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const invoice = mockInvoices.find(
    (inv) => inv.id === invoiceId && inv.userId === userId
  );

  if (!invoice) {
    return res.status(404).json({
      success: false,
      error: "Invoice not found",
    });
  }

  if (invoice.status !== "draft") {
    return res.status(400).json({
      success: false,
      error: "Can only send draft invoices",
    });
  }

  // In production: queue email via email service
  // await emailService.sendInvoice(invoice);

  invoice.status = "sent";
  invoice.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: invoice,
    message: "Invoice sent to client successfully",
  });
};

/**
 * DELETE /api/invoices/:invoiceId
 * Delete invoice (only draft invoices)
 */
export const deleteInvoice: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { invoiceId } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const invoiceIndex = mockInvoices.findIndex(
    (inv) => inv.id === invoiceId && inv.userId === userId
  );

  if (invoiceIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Invoice not found",
    });
  }

  const invoice = mockInvoices[invoiceIndex];

  if (invoice.status !== "draft") {
    return res.status(400).json({
      success: false,
      error: "Can only delete draft invoices",
    });
  }

  mockInvoices.splice(invoiceIndex, 1);

  res.json({
    success: true,
    message: "Invoice deleted successfully",
  });
};

/**
 * GET /api/invoices/public/:invoiceId
 * Get invoice by public link (no auth required)
 * Used for customer payment page
 */
export const getInvoicePublic: RequestHandler = (req, res) => {
  const { invoiceId } = req.params;

  const invoice = mockInvoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      error: "Invoice not found",
    });
  }

  // Only return invoices that are sent or paid
  if (!["sent", "paid", "partially_paid"].includes(invoice.status)) {
    return res.status(403).json({
      success: false,
      error: "This invoice is not yet available for payment",
    });
  }

  res.json({
    success: true,
    data: invoice,
  });
};

/**
 * POST /api/invoices/:invoiceId/record-payment
 * Record a payment for an invoice
 */
export const recordPayment: RequestHandler = (req, res) => {
  const { invoiceId } = req.params;
  const { amount, paymentMethod, stripePaymentIntentId } = req.body;

  const invoice = mockInvoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      error: "Invoice not found",
    });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      error: "Valid payment amount is required",
    });
  }

  if (amount > invoice.total) {
    return res.status(400).json({
      success: false,
      error: "Payment amount exceeds invoice total",
    });
  }

  // Update invoice
  invoice.status = amount >= invoice.total ? "paid" : "partially_paid";
  invoice.paymentDate = new Date().toISOString();
  invoice.paymentMethod = paymentMethod || "stripe";
  invoice.stripePaymentIntentId = stripePaymentIntentId;
  invoice.updatedAt = new Date().toISOString();

  // In production: send receipt email
  // await emailService.sendPaymentReceipt(invoice);

  res.json({
    success: true,
    data: invoice,
    message: "Payment recorded successfully. Receipt sent to client.",
  });
};
