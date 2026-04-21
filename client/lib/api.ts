/**
 * API Client Service
 * Centralized service for all backend API calls
 */

const API_BASE_URL = "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private getHeaders(contentType: string = "application/json") {
    const headers: Record<string, string> = {
      "Content-Type": contentType,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const options: RequestInit = {
        method,
        headers: this.getHeaders(),
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - clear it
          this.clearToken();
        }

        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        error: message,
      };
    }
  }

  // ==================== AUTHENTICATION ====================

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    return this.request("/auth/signup", "POST", {
      email,
      password,
      firstName,
      lastName,
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      user: { id: string; email: string };
      token: string;
    }>("/auth/login", "POST", { email, password });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
    return this.request("/auth/logout", "POST");
  }

  // ==================== USER ====================

  async getProfile() {
    return this.request("/users/profile", "GET");
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    businessName?: string;
  }) {
    return this.request("/users/profile", "PUT", data);
  }

  async updateSettings(data: unknown) {
    return this.request("/users/settings", "PUT", data);
  }

  // ==================== WALLETS ====================

  async getWallets() {
    return this.request("/wallets", "GET");
  }

  async getWallet(walletId: string) {
    return this.request(`/wallets/${walletId}`, "GET");
  }

  async createWallet(data: {
    name: string;
    type: string;
    currency?: string;
  }) {
    return this.request("/wallets", "POST", data);
  }

  async updateWallet(walletId: string, data: { name?: string }) {
    return this.request(`/wallets/${walletId}`, "PUT", data);
  }

  async deleteWallet(walletId: string) {
    return this.request(`/wallets/${walletId}`, "DELETE");
  }

  async transferFunds(walletId: string, data: unknown) {
    return this.request(`/wallets/${walletId}/transfer`, "POST", data);
  }

  // ==================== TRANSACTIONS ====================

  async getTransactions(params?: Record<string, unknown>) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }
    const endpoint = `/transactions${query ? `?${query}` : ""}`;
    return this.request(endpoint, "GET");
  }

  async getTransaction(transactionId: string) {
    return this.request(`/transactions/${transactionId}`, "GET");
  }

  async getTransactionCategories() {
    return this.request("/transactions/categories", "GET");
  }

  async exportTransactions(data: { format: string; walletId?: string }) {
    return this.request("/transactions/export", "POST", data);
  }

  // ==================== PAYMENT METHODS ====================

  async getPaymentMethods() {
    return this.request("/payment-methods", "GET");
  }

  async getPaymentMethod(methodId: string) {
    return this.request(`/payment-methods/${methodId}`, "GET");
  }

  async addPaymentMethod(data: unknown) {
    return this.request("/payment-methods", "POST", data);
  }

  async updatePaymentMethod(methodId: string, data: unknown) {
    return this.request(`/payment-methods/${methodId}`, "PUT", data);
  }

  async verifyPaymentMethod(methodId: string, verificationCode: string) {
    return this.request(`/payment-methods/${methodId}/verify`, "POST", {
      verificationCode,
    });
  }

  async deletePaymentMethod(methodId: string) {
    return this.request(`/payment-methods/${methodId}`, "DELETE");
  }

  // ==================== PAYMENTS ====================

  async processPayment(data: unknown) {
    return this.request("/payments/process", "POST", data);
  }

  async getPaymentStatus(paymentId: string) {
    return this.request(`/payments/${paymentId}`, "GET");
  }

  async refundPayment(paymentId: string, reason?: string) {
    return this.request(`/payments/${paymentId}/refund`, "POST", { reason });
  }

  async getPayments(status?: string) {
    const endpoint = status ? `/payments?status=${status}` : "/payments";
    return this.request(endpoint, "GET");
  }

  // ==================== INVOICES ====================

  async listInvoices(status?: string) {
    const endpoint = status ? `/invoices?status=${status}` : "/invoices";
    return this.request(endpoint, "GET");
  }

  async getInvoice(invoiceId: string) {
    return this.request(`/invoices/${invoiceId}`, "GET");
  }

  async createInvoice(data: unknown) {
    return this.request("/invoices", "POST", data);
  }

  async updateInvoice(invoiceId: string, data: unknown) {
    return this.request(`/invoices/${invoiceId}`, "PUT", data);
  }

  async sendInvoice(invoiceId: string) {
    return this.request(`/invoices/${invoiceId}/send`, "POST");
  }

  async deleteInvoice(invoiceId: string) {
    return this.request(`/invoices/${invoiceId}`, "DELETE");
  }

  async getInvoicePublic(invoiceId: string) {
    // This endpoint doesn't require authentication
    const response = await fetch(
      `/api/invoices/public/${invoiceId}`
    );
    return await response.json();
  }

  async recordPayment(invoiceId: string, data: unknown) {
    return this.request(`/invoices/${invoiceId}/payment`, "POST", data);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export type for responses
export type { ApiResponse };
