import type { ForecastDay } from "@/types/weather";
import { getWeatherCodeData } from "@/lib/weatherCodes";

type ForecastItemProps = {
  forecast: ForecastDay;
};

export function ForecastItem({ forecast }: ForecastItemProps) {
  const WeatherIcon = getWeatherCodeData(forecast.weatherCode).icon;

  return (
    <li className="grid w-full min-w-0 grid-cols-[72px_112px_minmax(0,1fr)] items-center text-white sm:grid-cols-[120px_140px_minmax(0,1fr)] lg:grid-cols-[150px_220px_minmax(0,1fr)]">
      <span className="min-w-0 truncate text-[17px] font-light capitalize leading-none tracking-[-0.04em] text-white sm:text-[20px] lg:text-[22px]">
        {forecast.dayName}
      </span>

      <span className="grid w-[90px] grid-cols-[32px_58px] items-center justify-self-center sm:w-[112px] sm:grid-cols-[36px_76px] lg:w-[130px] lg:grid-cols-[40px_90px]">
        <span
          aria-label={forecast.weatherLabel}
          title={forecast.weatherLabel}
          className="flex h-8 w-8 shrink-0 items-center justify-center justify-self-center text-white sm:h-9 sm:w-9"
        >
          <WeatherIcon
            size={18}
            strokeWidth={1.8}
            className="block sm:size-5 lg:size-6"
          />
        </span>

        <span className="block justify-self-start text-left text-[17px] font-light leading-none tracking-[-0.04em] text-white tabular-nums sm:text-[20px] lg:text-[22px]">
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