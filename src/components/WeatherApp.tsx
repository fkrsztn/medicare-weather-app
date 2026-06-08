"use client";

import { useCallback, useEffect, useState } from "react";
import { CitySearchModal } from "@/components/CitySearchModal";
import { CurrentWeather } from "@/components/CurrentWeather";
import { ForecastList } from "@/components/ForecastList";
import { TemperatureChart } from "@/components/TemperatureChart";
import { getStoredCity, storeCity } from "@/lib/localStorage";
import { getWeatherForecast, searchCities } from "@/lib/openMeteo";
import type {
  City,
  CurrentWeather as CurrentWeatherType,
  ForecastDay,
} from "@/types/weather";

export function WeatherApp() {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isCitySearchOpen, setIsCitySearchOpen] = useState(false);

  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherType | null>(null);
  const [forecastDays, setForecastDays] = useState<ForecastDay[]>([]);

  const [cityResults, setCityResults] = useState<City[]>([]);
  const [isCitySearchLoading, setIsCitySearchLoading] = useState(false);
  const [citySearchError, setCitySearchError] = useState<string | null>(null);

  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const hasWeatherData = currentWeather !== null && forecastDays.length > 0;
  const isCitySelectionRequired = hasInitialized && !currentWeather;

  function openCitySearch() {
    setIsCitySearchOpen(true);
  }

  const loadWeatherForCity = useCallback(async (city: City) => {
    try {
      setIsWeatherLoading(true);
      setWeatherError(null);

      const weatherData = await getWeatherForecast(city);

      setCurrentWeather(weatherData.currentWeather);
      setForecastDays(weatherData.forecastDays);
    } catch {
      setCurrentWeather(null);
      setForecastDays([]);
      setWeatherError("Nem sikerült lekérni az időjárási adatokat.");
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedCity = getStoredCity();

    setHasInitialized(true);

    if (!storedCity) {
      setIsCitySearchOpen(true);
      return;
    }

    void loadWeatherForCity(storedCity);
  }, [loadWeatherForCity]);

  const handleSearchCity = useCallback(async (query: string) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setCityResults([]);
      setCitySearchError(null);
      setIsCitySearchLoading(false);
      return;
    }

    try {
      setIsCitySearchLoading(true);
      setCitySearchError(null);

      const cities = await searchCities(normalizedQuery);

      setCityResults(cities);
    } catch {
      setCityResults([]);
      setCitySearchError("Nem sikerült lekérni a városokat.");
    } finally {
      setIsCitySearchLoading(false);
    }
  }, []);

  function handleSelectCity(city: City) {
    storeCity(city);
    setIsCitySearchOpen(false);
    setCityResults([]);
    setCitySearchError(null);
    setWeatherError(null);

    void loadWeatherForCity(city);
  }

  return (
    <>
      <main className="min-h-screen px-[37px] pt-[52px] pb-[10px] text-white sm:px-12 lg:px-8 lg:pt-[96px] lg:pb-[20px]">
        <div className="mx-auto flex min-h-[calc(100vh-62px)] w-full max-w-[942px] flex-col lg:min-h-[calc(100vh-116px)]">
          {!hasInitialized ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-[18px] font-light tracking-[-0.04em] text-white/80">
                Betöltés...
              </p>
            </div>
          ) : isWeatherLoading && !hasWeatherData ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-[18px] font-light tracking-[-0.04em] text-white/80">
                Időjárási adatok betöltése...
              </p>
            </div>
          ) : weatherError && !hasWeatherData ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              <p className="text-[18px] font-light tracking-[-0.04em] text-white/85">
                {weatherError}
              </p>

              <button
                type="button"
                onClick={openCitySearch}
                className="rounded-full border border-white/40 bg-white/10 px-5 py-3 text-[15px] font-light text-white transition hover:bg-white/20"
              >
                Másik város választása
              </button>
            </div>
          ) : hasWeatherData ? (
            <>
              <div className="grid items-start lg:grid-cols-[210px_660px] lg:gap-x-[72px]">
                <CurrentWeather
                  weather={currentWeather}
                  onCityClick={openCitySearch}
                />

                <div className="mt-[56px] lg:mt-0">
                  <ForecastList forecastDays={forecastDays} />
                </div>

                <div className="hidden lg:block" />

                <div className="mt-[54px] hidden min-w-0 lg:mt-[56px] lg:block">
                  <TemperatureChart forecastDays={forecastDays} />
                </div>
              </div>

              <div className="mt-6 min-h-6">
                {isWeatherLoading && (
                  <p className="text-center text-[15px] font-light text-white/70 lg:text-left">
                    Frissítés...
                  </p>
                )}

                {weatherError && (
                  <p className="text-center text-[15px] font-light text-white/80 lg:text-left">
                    {weatherError}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              <p className="text-[18px] font-light tracking-[-0.04em] text-white/85">
                Válassz egy várost az időjárás megjelenítéséhez.
              </p>

              <button
                type="button"
                onClick={openCitySearch}
                className="rounded-full border border-white/40 bg-white/10 px-5 py-3 text-[15px] font-light text-white transition hover:bg-white/20"
              >
                Város kiválasztása
              </button>
            </div>
          )}

          <footer className="mt-auto pt-10 text-center text-[16px] font-light tracking-[-0.04em] text-white/80 lg:pt-6 lg:text-left">
            Krisztián
          </footer>
        </div>
      </main>

      {hasInitialized && (
        <CitySearchModal
          isOpen={isCitySearchOpen}
          isRequired={isCitySelectionRequired}
          cities={cityResults}
          isLoading={isCitySearchLoading}
          errorMessage={citySearchError}
          onClose={() => setIsCitySearchOpen(false)}
          onSearchCity={handleSearchCity}
          onSelectCity={handleSelectCity}
        />
      )}
    </>
  );
}