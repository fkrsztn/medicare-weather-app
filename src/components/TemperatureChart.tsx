"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ForecastDay } from "@/types/weather";

type TemperatureChartProps = {
  forecastDays: ForecastDay[];
};

type ChartSize = {
  width: number;
  height: number;
};

export function TemperatureChart({ forecastDays }: TemperatureChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState<ChartSize>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const element = chartContainerRef.current;

    if (!element) {
      return;
    }

    function updateSize() {
      if (!element) {
        return;
      }

      const { width, height } = element.getBoundingClientRect();

      setChartSize({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    }

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (forecastDays.length === 0) {
    return null;
  }

  const chartData = forecastDays.map((day) => ({
    day: day.dayName.slice(0, 3),
    maxTemperature: day.maxTemperature,
  }));

  const canRenderChart = chartSize.width > 0 && chartSize.height > 0;

  return (
    <section className="w-full max-w-full lg:w-[578px]">
      <div className="h-[338px] w-full rounded-[28px] border border-white/90 px-8 py-6">
        <div ref={chartContainerRef} className="h-full w-full min-w-0">
          {canRenderChart && (
            <LineChart
              width={chartSize.width}
              height={chartSize.height}
              data={chartData}
              margin={{
                top: 0,
                right: 8,
                bottom: 0,
                left: -16,
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
                  fontSize: 12,
                }}
              />

              <YAxis
                width={48}
                tickMargin={10}
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
          )}
        </div>
      </div>
    </section>
  );
}