import { CurrentWeather } from "@/components/CurrentWeather";
import { ForecastList } from "@/components/ForecastList";
import { TemperatureChart } from "@/components/TemperatureChart";
import { mockCurrentWeather, mockForecastDays } from "@/lib/mockWeather";

export function WeatherApp() {
  return (
    <main className="min-h-screen px-[37px] pt-[52px] pb-[10px] text-white sm:px-12 lg:px-8 lg:pt-[96px] lg:pb-[20px]">
      <div className="mx-auto flex min-h-[calc(100vh-62px)] w-full max-w-[920px] flex-col lg:min-h-[calc(100vh-116px)]">
        <div className="grid items-start lg:grid-cols-[210px_700px] lg:gap-x-[72px]">
          <CurrentWeather weather={mockCurrentWeather} />

          <div className="mt-[56px] lg:mt-0">
            <ForecastList forecastDays={mockForecastDays} />
          </div>

          <div className="hidden lg:block" />

          <div className="mt-[54px] hidden min-w-0 lg:mt-[56px] lg:block">
            <TemperatureChart forecastDays={mockForecastDays} />
          </div>
        </div>

        <footer className="mt-auto pt-10 text-center text-[16px] font-light tracking-[-0.04em] text-white/80 lg:pt-6 lg:text-left">
          Krisztián
        </footer>
      </div>
    </main>
  );
}