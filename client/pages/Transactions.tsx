import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Filter } from "lucide-react";
import { useState } from "react";

const transactions = [
  {
    id: 1,
    description: "Stripe Payment",
    category: "Income",
    amount: 1200.0,
    date: "2024-01-15",
    status: "completed",
    type: "credit",
  },
  {
    id: 2,
    description: "Office Supplies",
    category: "Business",
    amount: 245.5,
    date: "2024-01-14",
    status: "completed",
    type: "debit",
  },
  {
    id: 3,
    description: "Client Invoice",
    category: "Income",
    amount: 3500.0,
    date: "2024-01-13",
    status: "completed",
    type: "credit",
  },
  {
    id: 4,
    description: "Software License",
    category: "Software",
    amount: 99.99,
    date: "2024-01-12",
    status: "completed",
    type: "debit",
  },
  {
    id: 5,
    description: "Freelance Project",
    category: "Income",
    amount: 2100.0,
    date: "2024-01-11",
    status: "completed",
    type: "credit",
  },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout title="Transactions">
      <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Transaction History
            </h2>
            <p className="text-muted-foreground">
              View and manage all your transactions
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="fin-card">
          <div className="fin-card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-muted-foreground"
                />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter by Type */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="flex items-center gap-2">
                  <Filter size={18} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="credit">Income</SelectItem>
                  <SelectItem value="debit">Expenses</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range (placeholder) */}
              <Button variant="outline" className="gap-2">
                <span>Date Range</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="fin-card">
          <div className="fin-card-content">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                      Category
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-sm">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-4 px-4 text-foreground font-medium">
                          {tx.description}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">
                          {tx.category}
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-semibold ${
                            tx.type === "credit"
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}$
                          {tx.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">
                          {tx.date}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 capitalize">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <p className="text-muted-foreground">
                          No transactions found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
