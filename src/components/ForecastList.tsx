import type { ForecastDay } from "@/types/weather";
import { ForecastItem } from "./ForecastItem";

type ForecastListProps = {
  forecastDays: ForecastDay[];
};

export function ForecastList({ forecastDays }: ForecastListProps) {
  return (
    <section className="w-full lg:w-[700px]">
      <p className="mb-7 text-[16px] font-light leading-none tracking-[-0.04em] text-white/85 lg:mb-8">
        7 napos előrejelzés
      </p>

      <ul className="flex flex-col gap-y-8 lg:gap-y-9">
        {forecastDays.map((forecast) => (
          <ForecastItem key={forecast.id} forecast={forecast} />
        ))}
      </ul>
    </section>
  );
}