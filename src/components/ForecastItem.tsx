import type { ForecastDay } from "@/types/weather";
import { CloudRain } from "lucide-react";

type ForecastItemProps = {
  forecast: ForecastDay;
};

export function ForecastItem({ forecast }: ForecastItemProps) {
  return (
    <li className="grid grid-cols-[74px_28px_56px_1fr] items-center gap-x-4 text-white sm:grid-cols-[86px_32px_64px_1fr] lg:grid-cols-[150px_40px_72px_1fr] lg:gap-x-6">
      <span className="text-[18px] font-light leading-none tracking-[-0.04em] text-white sm:text-[20px] lg:text-[22px]">
        {forecast.dayName}
      </span>

      <span
        aria-label={forecast.weatherLabel}
        title={forecast.weatherLabel}
        className="flex items-center justify-center text-white"
      >
        <CloudRain size={18} strokeWidth={1.8} className="sm:size-5 lg:size-6" />
      </span>

      <span className="text-[18px] font-light leading-none tracking-[-0.04em] text-white sm:text-[20px] lg:text-[22px]">
        {forecast.precipitation}%
      </span>

      <span className="text-right text-[18px] font-light leading-none tracking-[-0.04em] text-white sm:text-[20px] lg:text-[22px]">
        {forecast.minTemperature} °C / {forecast.maxTemperature} °C
      </span>
    </li>
  );
}