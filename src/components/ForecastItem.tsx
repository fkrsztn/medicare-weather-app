import type { ForecastDay } from "@/types/weather";
import { getWeatherCodeData } from "@/lib/weatherCodes";

type ForecastItemProps = {
  forecast: ForecastDay;
};

export function ForecastItem({ forecast }: ForecastItemProps) {
  const WeatherIcon = getWeatherCodeData(forecast.weatherCode).icon;

  return (
    <li className="grid w-full min-w-0 grid-cols-[96px_24px_44px_minmax(0,1fr)] items-center gap-x-2 text-white sm:grid-cols-[130px_36px_84px_1fr] sm:gap-x-5 lg:grid-cols-[150px_220px_1fr] lg:gap-x-6">
      <span className="min-w-0 truncate text-[17px] font-light capitalize leading-none tracking-[-0.04em] text-white sm:text-[20px] lg:text-[22px]">
        {forecast.dayName}
      </span>

      <span className="contents lg:flex lg:items-center lg:justify-center lg:gap-x-5">
        <span
          aria-label={forecast.weatherLabel}
          title={forecast.weatherLabel}
          className="flex items-center justify-center text-white"
        >
          <WeatherIcon
            size={18}
            strokeWidth={1.8}
            className="sm:size-5 lg:size-6"
          />
        </span>

        <span className="block text-right text-[17px] font-light leading-none tracking-[-0.04em] text-white tabular-nums sm:w-[72px] sm:text-[20px] lg:w-auto lg:text-[22px]">
          {forecast.precipitation}%
        </span>
      </span>

      <span className="block min-w-0 justify-self-end whitespace-nowrap text-right text-[17px] font-light leading-none tracking-[-0.04em] text-white tabular-nums sm:text-[20px] lg:text-[22px]">
        <span className="sm:hidden">
          {forecast.minTemperature}° / {forecast.maxTemperature}°
        </span>

        <span className="hidden sm:inline">
          {forecast.minTemperature} °C / {forecast.maxTemperature} °C
        </span>
      </span>
    </li>
  );
}