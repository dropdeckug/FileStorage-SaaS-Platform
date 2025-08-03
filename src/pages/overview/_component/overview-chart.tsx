import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import StorageUsage from "./storage-usage";
import { formatBytes } from "@/lib/format-utils";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { ChartDataType } from "@/features/analytics/anayticsType";
import { Skeleton } from "@/components/ui/skeleton";

// Example data - replace with your actual data source
const mockUserUploads = [
  { date: "2025-07-31", uploadedFiles: 6, usages: 19197647 },
  { date: "2025-07-30", uploadedFiles: 4, usages: 18131764 },
  { date: "2025-07-29", uploadedFiles: 2, usages: 7582352 },
  { date: "2025-07-28", uploadedFiles: 0, usages: 0 },
  { date: "2025-07-27", uploadedFiles: 3, usages: 9910588 },
  { date: "2025-07-26", uploadedFiles: 7, usages: 31243529 },
  { date: "2025-07-25", uploadedFiles: 5, usages: 14678823 },
  { date: "2025-07-24", uploadedFiles: 1, usages: 3347058 },
  { date: "2025-07-23", uploadedFiles: 4, usages: 12369411 },
  { date: "2025-07-22", uploadedFiles: 2, usages: 6592941 },
  { date: "2025-07-21", uploadedFiles: 0, usages: 0 },
  { date: "2025-07-20", uploadedFiles: 6, usages: 19977647 },
  { date: "2025-07-19", uploadedFiles: 5, usages: 26127058 },
  { date: "2025-07-18", uploadedFiles: 3, usages: 9327058 },
  { date: "2025-07-17", uploadedFiles: 0, usages: 0 },
  { date: "2025-07-16", uploadedFiles: 4, usages: 11612941 },
  { date: "2025-07-15", uploadedFiles: 7, usages: 20634117 },
  { date: "2025-07-14", uploadedFiles: 2, usages: 9964705 },
  { date: "2025-07-13", uploadedFiles: 0, usages: 0 },
  { date: "2025-07-12", uploadedFiles: 3, usages: 7000010 },
  { date: "2025-07-11", uploadedFiles: 6, usages: 15000000 },
  { date: "2025-07-10", uploadedFiles: 1, usages: 2000529 },
  { date: "2025-07-09", uploadedFiles: 0, usages: 0 },
  { date: "2025-07-08", uploadedFiles: 2, usages: 9001176 },
  { date: "2025-07-07", uploadedFiles: 5, usages: 14365882 },
  { date: "2025-07-06", uploadedFiles: 3, usages: 9600000 },
  { date: "2025-07-05", uploadedFiles: 4, usages: 20000000 },
  { date: "2025-07-04", uploadedFiles: 0, usages: 0 },
  { date: "2025-07-03", uploadedFiles: 6, usages: 19999647 },
];

const COLORS = ["var(--primary)", "var(--chart-1)"];

const CHART_TYPES = {
  uploads: {
    label: "Uploaded Files",
    color: COLORS[0],
  },
  usage: {
    label: "Usage",
    color: COLORS[1],
  },
} as const;

const chartConfig: ChartConfig = {
  uploads: {
    label: "Uploaded",
    color: COLORS[0],
  },
  usage: {
    label: "Usage",
    color: COLORS[1],
  },
} satisfies ChartConfig;

// Generate past month data with zeros for new users
const generatePast30DaysData = (chartData: ChartDataType[] = []) => {
  const today = startOfDay(new Date()); // Ensures consistent time
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    const dateString = format(date, "yyyy-MM-dd");

    const data = chartData.find((d) => d.date === dateString);

    return {
      date: dateString,
      uploads: data?.uploadedFiles ?? 0,
      usage: data?.usages ?? 0,
      formatedUsage: data?.formatedUsages ?? "0B",
    };
  });
};

export function OverviewChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof CHART_TYPES>("uploads");

  const from = subDays(startOfDay(new Date()), 29); // substract
  const to = endOfDay(new Date());
  console.log(from, to);

  // const { data, isLoading } = useGetUserAnalyticsWithChartQuery({
  //   from: from.toISOString(),
  //   to: to.toISOString(),
  // });

  const isLoading = false;

  const filledChartData = generatePast30DaysData(mockUserUploads || []);
  // Calculate totals
  const totals = React.useMemo(
    () => ({
      uploads: filledChartData.reduce((acc, curr) => acc + curr.uploads, 0),
      usage: formatBytes(
        filledChartData.reduce((acc, curr) => acc + curr.usage, 0)
      ),
    }),
    [filledChartData]
  );
  // const totals = {
  //   uploads: data?.totalUploadedFilesForPeriod ?? 0,
  //   usage: data?.totalUsageForPeriod ?? "0B",
  // };

  const storageData = {
    totalUsage: 490000000,
    quota: 2147483648,
    formattedTotalUsage: "302.95MB",
    formattedQuota: "2GB",
  };

  return (
    <Card className="pt-5 lg:pt-0">
      <CardHeader className="relative flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row sm:items-start">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 sm:py-6">
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription className="text-xs lg:text-sm">
            Showing upload and usage history for the last 30 days
          </CardDescription>
        </div>

        <div className="flex">
          {Object.entries(CHART_TYPES).map(([key, config]) => {
            const chartKey = key as keyof typeof CHART_TYPES;
            const isActive = activeChart === chartKey;
            const value = totals[chartKey];
            // const formatValue =
            //   chartKey === "usage" ? formatBytes(value) : value;

            return (
              <button
                key={chartKey}
                data-active={isActive}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 !cursor-pointer space-y-1"
                onClick={() => {
                  if (isLoading) return;
                  setActiveChart(chartKey);
                }}
              >
                {isLoading ? (
                  <div className="space-y-1 min-w-48 min-h-28">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {config.label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {value}
                    </span>
                    <span className="flex min-w-[17ch] gap-x-1 text-xs text-muted-foreground">
                      +{value} past 30 days
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6 !pb-px">
        <div className="flex flex-col gap-y-4">
          <div>
            {isLoading ? (
              <Skeleton className="h-[230px] w-full rounded-md" />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={filledChartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                        formatter={(value, name) => {
                          const chartKey = name as keyof typeof CHART_TYPES;
                          const color =
                            chartConfig[name as keyof typeof chartConfig]
                              ?.color;
                          const formatValue =
                            chartKey === "usage"
                              ? formatBytes(Number(value.toString()))
                              : value;
                          return (
                            <div className="w-full max-w-sm flex items-center !justify-between">
                              <div className="flex-1 flex items-center gap-2">
                                <div
                                  className="h-2 w-2 shrink-0 rounded-[2px]"
                                  style={{
                                    backgroundColor: color,
                                  }}
                                />
                                <span>
                                  {chartConfig[name as keyof typeof chartConfig]
                                    ?.label || name}
                                </span>
                              </div>
                              <div>{formatValue}</div>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey={activeChart}
                    fill={CHART_TYPES[activeChart].color}
                    radius={[2, 2, 0, 0]}
                  />

                  <ChartLegend
                    verticalAlign="bottom"
                    content={<ChartLegendContent />}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </div>

          {/* {Storage Usage} */}
          <StorageUsage
            usage={storageData?.totalUsage ?? 0} // 500MB in bytes
            quota={storageData?.quota ?? 0} // 2GB in bytes
            formattedUsage={storageData?.formattedTotalUsage || "0B"}
            formattedQuota={storageData?.formattedQuota || "2GB"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
