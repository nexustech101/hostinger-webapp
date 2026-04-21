import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Lock } from "lucide-react";

const paymentMethods = [
  {
    id: 1,
    type: "card",
    name: "Visa Card",
    last4: "4242",
    expiryDate: "12/25",
    isDefault: true,
    brand: "visa",
  },
  {
    id: 2,
    type: "bank",
    name: "Chase Bank Account",
    last4: "6789",
    isDefault: false,
    brand: "bank",
  },
  {
    id: 3,
    type: "card",
    name: "Mastercard",
    last4: "5555",
    expiryDate: "08/24",
    isDefault: false,
    brand: "mastercard",
  },
];

export default function CardsPage() {
  return (
    <AppLayout title="Payment Methods">
      <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Payment Methods
            </h2>
            <p className="text-muted-foreground">
              Add and manage your payment methods securely
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Add Payment Method
          </Button>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="fin-card hover:shadow-md transition-shadow">
              <div className="fin-card-content">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Card Icon */}
                    <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <Lock size={20} className="text-primary-foreground" />
                    </div>

                    {/* Card Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {method.name}
                        </h3>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.type === "card" ? (
                          <>••••••••••••{method.last4}</>
                        ) : (
                          <>Bank Account ••••{method.last4}</>
                        )}
                        {method.expiryDate && (
                          <span className="ml-4">Expires {method.expiryDate}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Security Info */}
        <Card className="fin-card bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
          <div className="fin-card-content flex items-start gap-3">
            <Lock size={20} className="text-info flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Your payment information is secure
              </h4>
              <p className="text-sm text-muted-foreground">
                We use industry-standard encryption to protect your payment details. Your
                cards are tokenized and never stored in full on our servers.
              </p>
            </div>
          </div>
        </Card>

        {/* Linked Accounts */}
        <Card className="fin-card">
          <div className="fin-card-header">
            <h3 className="font-semibold text-foreground">Linked Accounts</h3>
          </div>
          <div className="fin-card-content">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">PayPal</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Not linked</p>
                  <p className="text-xs text-muted-foreground">Square, CashApp, etc.</p>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
