import config from "../../config/app.config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  lineItems: any[];
  notes: string;
  status: string;
}

class EmailService {
  private service: string;

  constructor() {
    this.service = config.email.service;
  }

  /**
   * Send an email using the configured service
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      switch (this.service) {
        case "sendgrid":
          return await this.sendViaSendGrid(options);
        case "mailgun":
          return await this.sendViaMailgun(options);
        case "nodemailer":
          return await this.sendViaNodemailer(options);
        default:
          console.error(`Unknown email service: ${this.service}`);
          return false;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  /**
   * Send invoice to client
   */
  async sendInvoice(invoice: Invoice, paymentLink: string): Promise<boolean> {
    const html = this.generateInvoiceHtml(invoice, paymentLink);
    const text = this.generateInvoiceText(invoice, paymentLink);

    return this.sendEmail({
      to: invoice.clientEmail,
      subject: `Invoice ${invoice.invoiceNumber} from ${config.app.name}`,
      html,
      text,
    });
  }

  /**
   * Send payment receipt to client
   */
  async sendPaymentReceipt(invoice: Invoice): Promise<boolean> {
    const html = this.generateReceiptHtml(invoice);
    const text = this.generateReceiptText(invoice);

    return this.sendEmail({
      to: invoice.clientEmail,
      subject: `Payment Receipt - Invoice ${invoice.invoiceNumber}`,
      html,
      text,
    });
  }

  /**
   * SendGrid implementation
   */
  private async sendViaSegGrid(options: EmailOptions): Promise<boolean> {
    // In production, use @sendgrid/mail package
    // import sgMail from '@sendgrid/mail';
    // sgMail.setApiKey(config.email.sendgrid.apiKey);
    // await sgMail.send({...});
    console.log("SendGrid email would be sent:", options);
    return true;
  }

  /**
   * Mailgun implementation
   */
  private async sendViaMailgun(options: EmailOptions): Promise<boolean> {
    // In production, use mailgun.js package
    // const mailgun = require('mailgun.js');
    // const client = new mailgun.Mailgun({apiKey: config.email.mailgun.apiKey});
    // await client.messages.create(...);
    console.log("Mailgun email would be sent:", options);
    return true;
  }

  /**
   * Nodemailer implementation
   */
  private async sendViaNodemailer(options: EmailOptions): Promise<boolean> {
    // In production, use nodemailer package
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({...});
    console.log("Nodemailer email would be sent:", options);
    return true;
  }

  /**
   * Generate invoice HTML email
   */
  private generateInvoiceHtml(invoice: Invoice, paymentLink: string): string {
    const lineItemsHtml = invoice.lineItems
      .map(
        (item) =>
          `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.description}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(
          item.quantity * item.unitPrice
        ).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0F3460; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { border: 1px solid #ddd; border-top: none; padding: 20px; }
          .footer { background: #f5f5f5; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold; }
          .total-row { font-weight: bold; font-size: 16px; }
          .button { display: inline-block; background: #0F3460; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${config.app.name}</h1>
            <p>Invoice ${invoice.invoiceNumber}</p>
          </div>
          
          <div class="content">
            <h2>Hello ${invoice.clientName},</h2>
            <p>We've sent you an invoice for the services rendered. Please review the details below and proceed with payment.</p>
            
            <h3>Invoice Details</h3>
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Issue Date:</strong> ${invoice.issueDate}</p>
            <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
            
            <h3>Line Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${lineItemsHtml}
              </tbody>
            </table>
            
            <div style="text-align: right; margin: 20px 0;">
              <p><strong>Subtotal:</strong> $${invoice.amount.toFixed(2)}</p>
              <p><strong>Tax:</strong> $${invoice.tax.toFixed(2)}</p>
              <p class="total-row"><strong>Total:</strong> ${invoice.currency} $${invoice.total.toFixed(2)}</p>
            </div>
            
            ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ""}
            
            <div style="text-align: center;">
              <a href="${paymentLink}" class="button">Pay Now</a>
            </div>
          </div>
          
          <div class="footer">
            <p>If you have any questions about this invoice, please reply to this email.</p>
            <p style="font-size: 12px; color: #666;">© 2024 ${config.app.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate invoice plain text email
   */
  private generateInvoiceText(invoice: Invoice, paymentLink: string): string {
    const lineItems = invoice.lineItems
      .map(
        (item) =>
          `${item.description}: ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${(
            item.quantity * item.unitPrice
          ).toFixed(2)}`
      )
      .join("\n");

    return `
${config.app.name}
Invoice ${invoice.invoiceNumber}

Dear ${invoice.clientName},

Please find the details of your invoice below:

INVOICE DETAILS
Invoice Number: ${invoice.invoiceNumber}
Issue Date: ${invoice.issueDate}
Due Date: ${invoice.dueDate}

LINE ITEMS
${lineItems}

SUMMARY
Subtotal: $${invoice.amount.toFixed(2)}
Tax: $${invoice.tax.toFixed(2)}
Total: ${invoice.currency} $${invoice.total.toFixed(2)}

${invoice.notes ? `NOTES\n${invoice.notes}\n` : ""}

PAYMENT
To pay this invoice, please visit: ${paymentLink}

If you have any questions, please reply to this email.

© 2024 ${config.app.name}. All rights reserved.
    `;
  }

  /**
   * Generate payment receipt HTML
   */
  private generateReceiptHtml(invoice: Invoice): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { border: 1px solid #ddd; border-top: none; padding: 20px; }
          .footer { background: #f5f5f5; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
          .status { color: #10b981; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${config.app.name}</h1>
            <p>Payment Receipt</p>
          </div>
          
          <div class="content">
            <h2>Payment Received!</h2>
            <p class="status">✓ Your payment has been successfully processed.</p>
            
            <h3>Receipt Details</h3>
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Payment Amount:</strong> ${invoice.currency} $${invoice.total.toFixed(2)}</p>
            <p><strong>Payment Date:</strong> ${invoice.paymentDate || new Date().toISOString().split("T")[0]}</p>
            <p><strong>Status:</strong> PAID</p>
            
            <h3>Invoice Summary</h3>
            <p><strong>Subtotal:</strong> $${invoice.amount.toFixed(2)}</p>
            <p><strong>Tax:</strong> $${invoice.tax.toFixed(2)}</p>
            <p><strong>Total Paid:</strong> ${invoice.currency} $${invoice.total.toFixed(2)}</p>
            
            <p style="margin-top: 30px;">Thank you for your payment! If you have any questions, please don't hesitate to reach out.</p>
          </div>
          
          <div class="footer">
            <p style="font-size: 12px; color: #666;">© 2024 ${config.app.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate payment receipt plain text
   */
  private generateReceiptText(invoice: Invoice): string {
    return `
${config.app.name}
PAYMENT RECEIPT

Dear ${invoice.clientName},

Your payment has been successfully processed!

RECEIPT DETAILS
Invoice Number: ${invoice.invoiceNumber}
Payment Amount: ${invoice.currency} $${invoice.total.toFixed(2)}
Payment Date: ${invoice.paymentDate || new Date().toISOString().split("T")[0]}
Status: PAID

INVOICE SUMMARY
Subtotal: $${invoice.amount.toFixed(2)}
Tax: $${invoice.tax.toFixed(2)}
Total Paid: ${invoice.currency} $${invoice.total.toFixed(2)}

Thank you for your payment!

© 2024 ${config.app.name}. All rights reserved.
    `;
  }
}

export default new EmailService();
