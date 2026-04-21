import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { month: "Jan", revenue: 38500, profit: 14200, mrr: 22000 },
  { month: "Feb", revenue: 42100, profit: 16800, mrr: 23500 },
  { month: "Mar", revenue: 39800, profit: 13900, mrr: 23000 },
  { month: "Apr", revenue: 47300, profit: 19200, mrr: 25000 },
  { month: "May", revenue: 51200, profit: 21500, mrr: 27000 },
  { month: "Jun", revenue: 49600, profit: 20100, mrr: 26500 },
  { month: "Jul", revenue: 55800, profit: 24300, mrr: 29000 },
  { month: "Aug", revenue: 60200, profit: 27100, mrr: 31000 },
  { month: "Sep", revenue: 58400, profit: 25600, mrr: 30500 },
  { month: "Oct", revenue: 64100, profit: 29800, mrr: 33000 },
  { month: "Nov", revenue: 68900, profit: 32400, mrr: 35500 },
  { month: "Dec", revenue: 72450, profit: 35200, mrr: 38000 },
];

const formatCurrency = (value: number) =>
  `$${(value / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-medium text-foreground">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueGrowthChart() {
  return (
    <Card className="fin-card">
      <div className="fin-card-header flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Revenue Growth</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Annual overview — Revenue, Profit & MRR
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 rounded bg-indigo-500" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 rounded bg-emerald-500" />
            Profit
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 rounded bg-violet-400" />
            MRR
          </span>
        </div>
      </div>
      <div className="fin-card-content pt-2 pb-4 px-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradRevenue)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradProfit)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="mrr"
              name="MRR"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="url(#gradMRR)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}