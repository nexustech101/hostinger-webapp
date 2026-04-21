import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Lock, Check, AlertCircle } from "lucide-react";

// Mock invoice data - in production this would come from API
const mockInvoice = {
  id: "inv-1",
  invoiceNumber: "INV-001",
  clientName: "Acme Corporation",
  clientEmail: "billing@acme.com",
  issueDate: "2024-01-10",
  dueDate: "2024-02-10",
  amount: 2500.0,
  tax: 200.0,
  total: 2700.0,
  currency: "USD",
  status: "sent",
  lineItems: [
    { description: "Consulting Services", quantity: 20, unitPrice: 100, amount: 2000 },
    { description: "Development Hours", quantity: 10, unitPrice: 50, amount: 500 },
  ],
  notes: "Thank you for your business!",
  businessName: "FinFlow Business Solutions",
  businessEmail: "support@finflow.app",
};

export default function PaymentCollectionPage() {
  const [step, setStep] = useState<"invoice" | "payment" | "confirmation">(
    "invoice"
  );
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep("confirmation");
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Secure Payment</h1>
          <p className="text-muted-foreground">
            Complete your payment securely using the form below
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Invoice Details (Left) */}
          <div className="md:col-span-2">
            <Card className="fin-card">
              <div className="fin-card-header bg-primary text-primary-foreground">
                <h2 className="font-semibold text-lg">
                  {mockInvoice.invoiceNumber}
                </h2>
              </div>
              <div className="fin-card-content space-y-4">
                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bill From</p>
                    <p className="font-semibold text-foreground">
                      {mockInvoice.businessName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mockInvoice.businessEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bill To</p>
                    <p className="font-semibold text-foreground">
                      {mockInvoice.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mockInvoice.clientEmail}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
                    <p className="font-medium text-foreground">
                      {mockInvoice.issueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                    <p className="font-medium text-foreground">
                      {mockInvoice.dueDate}
                    </p>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Line Items</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                          Description
                        </th>
                        <th className="text-center py-2 px-2 text-muted-foreground font-medium w-16">
                          Qty
                        </th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium w-20">
                          Price
                        </th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium w-20">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoice.lineItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0">
                          <td className="py-2 px-2 text-foreground">
                            {item.description}
                          </td>
                          <td className="text-center py-2 px-2 text-foreground">
                            {item.quantity}
                          </td>
                          <td className="text-right py-2 px-2 text-foreground">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="text-right py-2 px-2 font-medium text-foreground">
                            ${item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-secondary/30 p-4 rounded space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      ${mockInvoice.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%):</span>
                    <span className="font-medium">
                      ${mockInvoice.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                    <span>Total Amount Due:</span>
                    <span className="text-primary">
                      {mockInvoice.currency} ${mockInvoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {mockInvoice.notes && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-3 rounded text-sm">
                    <p className="text-blue-900 dark:text-blue-100">
                      <strong>Note:</strong> {mockInvoice.notes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Payment Form (Right) */}
          <div>
            {step === "invoice" && (
              <Card className="fin-card">
                <div className="fin-card-header">
                  <h3 className="font-semibold text-foreground">
                    Ready to Pay?
                  </h3>
                </div>
                <div className="fin-card-content space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-3 rounded flex gap-2">
                    <Lock size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      All transactions are secure and encrypted.
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-foreground mb-4">
                      ${mockInvoice.total.toFixed(2)}
                    </p>
                  </div>

                  <Button
                    onClick={() => setStep("payment")}
                    className="w-full"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    You will not be charged until you confirm your order.
                  </p>
                </div>
              </Card>
            )}

            {step === "payment" && (
              <Card className="fin-card">
                <div className="fin-card-header">
                  <h3 className="font-semibold text-foreground">
                    Payment Details
                  </h3>
                </div>
                <div className="fin-card-content">
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Cardholder Name
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={cardData.cardName}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            cardName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Card Number
                      </label>
                      <Input
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={formatCardNumber(cardData.cardNumber)}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            cardNumber: e.target.value.replace(/\s/g, ""),
                          })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Expiry Date
                        </label>
                        <Input
                          placeholder="MM/YY"
                          maxLength={5}
                          value={formatExpiryDate(cardData.expiryDate)}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              expiryDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          CVV
                        </label>
                        <Input
                          placeholder="123"
                          maxLength={4}
                          type="password"
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cvv: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep("invoice")}
                        disabled={isProcessing}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Pay Now"}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      We use industry-standard SSL encryption
                    </p>
                  </form>
                </div>
              </Card>
            )}

            {step === "confirmation" && (
              <Card className="fin-card bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <div className="fin-card-content text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full bg-green-200 dark:bg-green-900 flex items-center justify-center mx-auto">
                    <Check size={32} className="text-green-600 dark:text-green-400" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                      Payment Successful!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                      Your payment has been received and processed.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-background p-4 rounded border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Amount Paid</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${mockInvoice.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-3 rounded text-sm text-blue-900 dark:text-blue-100">
                    <p>
                      A receipt has been sent to{" "}
                      <strong>{mockInvoice.clientEmail}</strong>
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
