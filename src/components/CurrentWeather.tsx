import type { CurrentWeather as CurrentWeatherType } from "@/types/weather";

type CurrentWeatherProps = {
  weather: CurrentWeatherType;
  onCityClick: () => void;
};

export function CurrentWeather({ weather, onCityClick }: CurrentWeatherProps) {
  return (
    <section className="flex flex-col items-start">
      <button
        type="button"
        onClick={onCityClick}
        className="pl-[5px] text-left text-[18px] font-light leading-none tracking-[-0.04em] text-white/85 transition-opacity hover:opacity-80 lg:text-[18px]"
      >
        {weather.city}
      </button>

      <div className="mt-2 flex items-start text-white">
        <span className="text-[68px] font-light leading-none tracking-[-0.08em] sm:text-[76px] lg:text-[84px]">
          {weather.temperature}
        </span>
        <span className="ml-2 pt-1 text-[32px] font-light leading-none tracking-[-0.05em] sm:text-[36px] lg:text-[42px]">
          °C
        </span>
      </div>

      <p className="mt-3 pl-[5px] text-[18px] font-light leading-none tracking-[-0.04em] text-white/90 lg:text-[20px]">
        {weather.weatherLabel}
      </p>
    </section>
  );
}