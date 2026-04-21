import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

interface HeatmapData {
  month: string;
  days: number[];
}

interface UsageHeatmapProps {
  data?: HeatmapData[];
}

export function UsageHeatmap({ data }: UsageHeatmapProps) {
  const { theme } = useTheme();

  // Generate mock heatmap data for 12 months
  const defaultData: HeatmapData[] = [
    {
      month: "January",
      days: Array.from({ length: 31 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "February",
      days: Array.from({ length: 28 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "March",
      days: Array.from({ length: 31 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "April",
      days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "May",
      days: Array.from({ length: 31 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "June",
      days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "July",
      days: Array.from({ length: 31 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "August",
      days: Array.from({ length: 31 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "September",
      days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "October",
      days: Array.from({ length: 31 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "November",
      days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
    {
      month: "December",
      days: Array.from({ length: 31 }, () => Math.floor(Math.random() * 100)),
    },
  ];

  const heatmapData = data || defaultData;

  const getColor = (value: number) => {
    if (theme === "dark") {
      if (value === 0) return "bg-slate-700";
      if (value < 25) return "bg-emerald-900";
      if (value < 50) return "bg-emerald-700";
      if (value < 75) return "bg-emerald-500";
      return "bg-emerald-300";
    } else {
      if (value === 0) return "bg-gray-200";
      if (value < 25) return "bg-emerald-100";
      if (value < 50) return "bg-emerald-300";
      if (value < 75) return "bg-emerald-500";
      return "bg-emerald-700";
    }
  };

  const getStartDay = (monthIndex: number) => {
    const date = new Date(2024, monthIndex, 1);
    return date.getDay();
  };

  const getDaysInMonth = (monthIndex: number) => {
    const date = new Date(2024, monthIndex + 1, 0);
    return date.getDate();
  };

  // Build a 7-row array of weeks with all months
  const buildHeatmapGrid = () => {
    const weeks = Array.from({ length: 52 }, () => Array(7).fill(null));
    let weekIndex = 0;
    let dayOfWeekIndex = 0;

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const startDay = getStartDay(monthIndex);
      const daysInMonth = getDaysInMonth(monthIndex);
      const monthName = heatmapData[monthIndex].month;

      if (dayOfWeekIndex > 0 && dayOfWeekIndex + daysInMonth > 7) {
        weekIndex++;
        dayOfWeekIndex = 0;
      }

      for (let day = 1; day <= daysInMonth; day++) {
        if (dayOfWeekIndex === 0 && weekIndex > 0 && dayOfWeekIndex === 0) {
          weekIndex++;
        }

        if (weekIndex < 52) {
          weeks[weekIndex][dayOfWeekIndex] = {
            value: heatmapData[monthIndex].days[day - 1],
            day,
            month: monthName,
          };
        }

        dayOfWeekIndex++;
        if (dayOfWeekIndex === 7) {
          dayOfWeekIndex = 0;
          weekIndex++;
        }
      }

      if (dayOfWeekIndex > 0) {
        weekIndex++;
        dayOfWeekIndex = 0;
      }
    }

    return weeks.filter((week) => week.some((day) => day !== null));
  };

  const heatmapGrid = buildHeatmapGrid();

  return (
    <Card className="fin-card">
      <div className="fin-card-header">
        <h3 className="font-semibold text-foreground">
          Daily Application Usage Heatmap
        </h3>
      </div>

      <div className="fin-card-content space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className={`w-3 h-3 rounded-sm ${theme === "dark" ? "bg-slate-700" : "bg-gray-200"}`} />
              <div className={`w-3 h-3 rounded-sm ${theme === "dark" ? "bg-emerald-900" : "bg-emerald-100"}`} />
              <div className={`w-3 h-3 rounded-sm ${theme === "dark" ? "bg-emerald-700" : "bg-emerald-300"}`} />
              <div className={`w-3 h-3 rounded-sm ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-500"}`} />
              <div className={`w-3 h-3 rounded-sm ${theme === "dark" ? "bg-emerald-300" : "bg-emerald-700"}`} />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>

        {/* GitHub-style Contribution Graph */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-1 min-w-full">
            {/* Day of week labels */}
            <div className="flex flex-col gap-1 pr-2">
              <div className="h-6 text-xs text-muted-foreground font-medium flex items-center">Mon</div>
              <div className="h-3 w-3"></div>
              <div className="h-3 w-3"></div>
              <div className="h-3 w-3"></div>
              <div className="h-3 w-3"></div>
              <div className="h-3 w-3"></div>
              <div className="h-3 w-3"></div>
              <div className="h-3 w-3"></div>
            </div>

            {/* Week columns */}
            {heatmapGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={
                      day === null
                        ? "h-3 w-3 rounded-sm"
                        : `h-3 w-3 rounded-sm transition-all cursor-pointer ${getColor(day.value)} hover:ring-1 hover:ring-foreground/50`
                    }
                    title={
                      day !== null
                        ? `${day.month} ${day.day}: ${day.value}% usage`
                        : ""
                    }
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="flex gap-1 mt-2 text-xs text-muted-foreground font-medium pl-8">
            {heatmapData.map((month) => (
              <div key={month.month} className="w-12">
                {month.month.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Most Active Day</p>
            <p className="font-bold text-foreground">45 actions</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Average Daily Usage</p>
            <p className="font-bold text-foreground">32 actions</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Days Active</p>
            <p className="font-bold text-foreground">289 / 365</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
