import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const wallets = [
  {
    id: 1,
    name: "Main Wallet",
    balance: 12450.75,
    currency: "USD",
    type: "primary",
  },
  {
    id: 2,
    name: "Savings",
    balance: 8500.0,
    currency: "USD",
    type: "savings",
  },
  {
    id: 3,
    name: "Business Account",
    balance: 3629.75,
    currency: "USD",
    type: "business",
  },
];

export default function WalletPage() {
  const [showBalances, setShowBalances] = useState(true);

  return (
    <AppLayout title="Wallet">
      <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Wallets
            </h2>
            <p className="text-muted-foreground">
              Manage your wallets and track balances across accounts
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Add Wallet
          </Button>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="fin-card hover:shadow-md transition-shadow">
              <div className="fin-card-content">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {wallet.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {wallet.type} account
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBalances(!showBalances)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    {showBalances ? (
                      <Eye size={18} className="text-muted-foreground" />
                    ) : (
                      <EyeOff size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Balance</p>
                  <p className="text-3xl font-bold text-foreground">
                    {showBalances ? (
                      `$${wallet.balance.toFixed(2)}`
                    ) : (
                      "••••••"
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Transfer
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Total Balance Card */}
        <Card className="fin-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="fin-card-content">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Total Balance Across All Wallets
            </p>
            <p className="text-4xl font-bold text-foreground">
              ${wallets.reduce((sum, w) => sum + w.balance, 0).toFixed(2)}
            </p>
          </div>
        </Card>

        {/* Recent Wallet Activity */}
        <Card className="fin-card">
          <div className="fin-card-header">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="fin-card-content">
            <p className="text-muted-foreground text-center py-8">
              No recent activity. Start by transferring funds between wallets.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
