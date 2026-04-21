import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

interface UsageData {
  month: string;
  transactions: number;
  customers: number;
}

interface RevenueStatisticsProps {
  revenueData?: RevenueData[];
  usageData?: UsageData[];
  period?: "30days" | "90days" | "1year" | "all";
}

export function RevenueStatistics({
  revenueData = [],
  usageData = [],
  period = "30days",
}: RevenueStatisticsProps) {
  // Default mock data if not provided - 12 months with quarterly divisions
  const defaultRevenueData = [
    { month: "Jan", revenue: 4000, expenses: 2400, quarter: "Q1" },
    { month: "Feb", revenue: 3500, expenses: 2100 },
    { month: "Mar", revenue: 5200, expenses: 2800, quarter: "Q1" },
    { month: "Apr", revenue: 4500, expenses: 2600, quarter: "Q2" },
    { month: "May", revenue: 6100, expenses: 3200 },
    { month: "Jun", revenue: 5800, expenses: 3100, quarter: "Q2" },
    { month: "Jul", revenue: 7200, expenses: 3800, quarter: "Q3" },
    { month: "Aug", revenue: 6900, expenses: 3500 },
    { month: "Sep", revenue: 8100, expenses: 4200, quarter: "Q3" },
    { month: "Oct", revenue: 7500, expenses: 3900, quarter: "Q4" },
    { month: "Nov", revenue: 8800, expenses: 4500 },
    { month: "Dec", revenue: 9200, expenses: 4800, quarter: "Q4" },
  ];

  const defaultUsageData = [
    { month: "Jan", transactions: 240, customers: 32 },
    { month: "Feb", transactions: 220, customers: 28 },
    { month: "Mar", transactions: 290, customers: 40 },
    { month: "Apr", transactions: 200, customers: 25 },
    { month: "May", transactions: 340, customers: 45 },
    { month: "Jun", transactions: 390, customers: 52 },
    { month: "Jul", transactions: 420, customers: 58 },
    { month: "Aug", transactions: 380, customers: 54 },
    { month: "Sep", transactions: 450, customers: 62 },
    { month: "Oct", transactions: 410, customers: 60 },
    { month: "Nov", transactions: 480, customers: 68 },
    { month: "Dec", transactions: 520, customers: 75 },
  ];

  const categoryData = [
    { name: "Groceries", value: 30 },
    { name: "Utilities", value: 20 },
    { name: "Transport", value: 25 },
    { name: "Entertainment", value: 15 },
    { name: "Other", value: 10 },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];

  const chartRevenueData = revenueData.length > 0 ? revenueData : defaultRevenueData;
  const chartUsageData = usageData.length > 0 ? usageData : defaultUsageData;

  const totalRevenue = chartRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = chartRevenueData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="fin-card">
          <div className="fin-card-content">
            <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-success">${totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Last {period === "30days" ? "30 days" : period === "90days" ? "90 days" : period === "1year" ? "year" : "all time"}
            </p>
          </div>
        </Card>

        <Card className="fin-card">
          <div className="fin-card-content">
            <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">${totalExpenses.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">Operating costs</p>
          </div>
        </Card>

        <Card className="fin-card">
          <div className="fin-card-content">
            <p className="text-sm text-muted-foreground mb-2">Net Profit</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-success" : "text-destructive"}`}>
              ${netProfit.toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {profitMargin}% margin
            </p>
          </div>
        </Card>

        <Card className="fin-card">
          <div className="fin-card-content">
            <p className="text-sm text-muted-foreground mb-2">Transactions</p>
            <p className="text-2xl font-bold text-primary">
              {chartUsageData.reduce((sum, item) => sum + item.transactions, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Total processed</p>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="fin-card">
        <div className="fin-card-header flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Revenue & Expenses Trend (Monthly)</h3>
        </div>
        <div className="fin-card-content space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>X-Axis: Months (Jan - Dec) | Y-Axis: Amount (USD)</p>
            <p className="mt-1">Vertical lines indicate quarterly divisions (Q1, Q2, Q3, Q4)</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              {/* Quarter Reference Lines */}
              <ReferenceLine x={2} stroke="#9ca3af" strokeDasharray="5 5" label={{ value: "Q1", position: "top" }} />
              <ReferenceLine x={5} stroke="#9ca3af" strokeDasharray="5 5" label={{ value: "Q2", position: "top" }} />
              <ReferenceLine x={8} stroke="#9ca3af" strokeDasharray="5 5" label={{ value: "Q3", position: "top" }} />
              <ReferenceLine x={11} stroke="#9ca3af" strokeDasharray="5 5" label={{ value: "Q4", position: "top" }} />
              <XAxis
                stroke="#9ca3af"
                dataKey="month"
                label={{ value: "Month", position: "bottom", offset: 10 }}
              />
              <YAxis
                stroke="#9ca3af"
                label={{ value: "Amount (USD)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => `$${value}`}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorExpenses)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Usage Chart */}
      <Card className="fin-card">
        <div className="fin-card-header flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Usage Statistics</h3>
        </div>
        <div className="fin-card-content">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
