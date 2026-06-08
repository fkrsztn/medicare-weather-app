"use client";

import type { ForecastDay } from "@/types/weather";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type TemperatureChartProps = {
  forecastDays: ForecastDay[];
};

export function TemperatureChart({ forecastDays }: TemperatureChartProps) {
  const chartData = forecastDays.map((day) => ({
    day: day.dayName.slice(0, 3),
    maxTemperature: day.maxTemperature,
    }));

  return (
    <section className="w-full min-w-0 lg:w-[700px]">
      <div className="h-[338px] min-h-[338px] w-full min-w-0 rounded-[28px] border border-white/90 px-8 py-6">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <LineChart
            data={chartData}
            margin={{
                top: 0,
                right: 24,
                bottom: 0,
                left: -4,
            }}
            >
            <CartesianGrid
              vertical={false}
              stroke="rgba(255, 255, 255, 0.25)"
            />

            <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            interval={0}
            tickMargin={10}
            padding={{ left: 0, right: 0 }}
            tick={{
                fill: "rgba(255, 255, 255, 0.85)",
                fontSize: 14,
            }}
            />

            <YAxis
            width={56}
            tickMargin={14}
            axisLine={false}
            tickLine={false}
            tick={{
                fill: "rgba(255, 255, 255, 0.8)",
                fontSize: 12,
            }}
            domain={["dataMin - 2", "dataMax + 2"]}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.18)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "12px",
                color: "#ffffff",
                backdropFilter: "blur(8px)",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
              itemStyle={{
                color: "#ffffff",
              }}
              formatter={(value) => [`${value} °C`, "Maximum"]}
            />

            <Line
              type="monotone"
              dataKey="maxTemperature"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 5,
                fill: "#ffffff",
                stroke: "#ffffff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}