/**
 * Application Configuration
 * Centralized configuration for all services and external integrations
 */

const NODE_ENV = process.env.NODE_ENV || "development";

interface Config {
  app: {
    name: string;
    version: string;
    url: string;
    environment: string;
  };
  api: {
    baseUrl: string;
    port: number;
  };
  database: {
    url?: string;
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  email: {
    service: "sendgrid" | "mailgun" | "nodemailer";
    from: string;
    fromName: string;
    sendgrid?: {
      apiKey: string;
    };
    mailgun?: {
      apiKey: string;
      domain: string;
    };
    nodemailer?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  };
  invoice: {
    defaultCurrency: string;
    defaultTaxRate: number;
    daysUntilOverdue: number;
    invoicePrefix: string;
  };
  logging: {
    level: "debug" | "info" | "warn" | "error";
    format: "json" | "text";
  };
}

const config: Config = {
  app: {
    name: "FinFlow",
    version: "1.0.0",
    url: process.env.APP_URL || "http://localhost:8080",
    environment: NODE_ENV,
  },

  api: {
    baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
    port: parseInt(process.env.PORT || "8080", 10),
  },

  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },

  email: {
    service: (process.env.EMAIL_SERVICE as "sendgrid" | "mailgun" | "nodemailer") || "nodemailer",
    from: process.env.EMAIL_FROM || "noreply@finflow.app",
    fromName: process.env.EMAIL_FROM_NAME || "FinFlow",
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || "",
    },
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY || "",
      domain: process.env.MAILGUN_DOMAIN || "",
    },
    nodemailer: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    },
  },

  invoice: {
    defaultCurrency: process.env.INVOICE_CURRENCY || "USD",
    defaultTaxRate: parseFloat(process.env.INVOICE_TAX_RATE || "0"),
    daysUntilOverdue: parseInt(process.env.INVOICE_DAYS_UNTIL_OVERDUE || "30", 10),
    invoicePrefix: process.env.INVOICE_PREFIX || "INV",
  },

  logging: {
    level: (process.env.LOG_LEVEL as "debug" | "info" | "warn" | "error") || "info",
    format: (process.env.LOG_FORMAT as "json" | "text") || "text",
  },
};

export default config;

/**
 * Validate required configuration
 */
export function validateConfig(): void {
  const requiredInProduction = {
    "STRIPE_SECRET_KEY": process.env.STRIPE_SECRET_KEY,
    "JWT_SECRET": process.env.JWT_SECRET,
    "EMAIL_SERVICE": process.env.EMAIL_SERVICE,
  };

  if (NODE_ENV === "production") {
    const missing = Object.entries(requiredInProduction)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(", ")}`
      );
    }
  }
}
