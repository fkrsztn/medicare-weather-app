"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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

const STORED_CITY_PENDING = "__stored_city_pending__";

function subscribeToStoredCity(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("weather-city-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("weather-city-change", onStoreChange);
  };
}

function getStoredCityClientSnapshot() {
  if (typeof window === "undefined") {
    return STORED_CITY_PENDING;
  }

  const storedCity = getStoredCity();

  if (!storedCity) {
    return null;
  }

  return JSON.stringify(storedCity);
}

function getStoredCityServerSnapshot() {
  return STORED_CITY_PENDING;
}

function useStoredCity() {
  const storedCitySnapshot = useSyncExternalStore(
    subscribeToStoredCity,
    getStoredCityClientSnapshot,
    getStoredCityServerSnapshot,
  );

  return useMemo(() => {
    if (storedCitySnapshot === STORED_CITY_PENDING) {
      return {
        isReady: false,
        city: null,
      };
    }

    if (!storedCitySnapshot) {
      return {
        isReady: true,
        city: null,
      };
    }

    try {
      return {
        isReady: true,
        city: JSON.parse(storedCitySnapshot) as City,
      };
    } catch {
      return {
        isReady: true,
        city: null,
      };
    }
  }, [storedCitySnapshot]);
}

export function WeatherApp() {
  const { isReady: isStoredCityReady, city: storedCity } = useStoredCity();

  const [isCitySearchOpen, setIsCitySearchOpen] = useState(false);

  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherType | null>(null);
  const [forecastDays, setForecastDays] = useState<ForecastDay[]>([]);

  const [cityResults, setCityResults] = useState<City[]>([]);
  const [isCitySearchLoading, setIsCitySearchLoading] = useState(false);
  const [citySearchError, setCitySearchError] = useState<string | null>(null);

  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const citySearchRequestIdRef = useRef(0);

  const hasWeatherData = currentWeather !== null && forecastDays.length > 0;

  const shouldLoadStoredCity =
    isStoredCityReady && storedCity !== null && !hasWeatherData && !weatherError;

  const isAppWeatherLoading = !isStoredCityReady || shouldLoadStoredCity || isWeatherLoading;

  const shouldForceCitySearch =
    isStoredCityReady &&
    storedCity === null &&
    !hasWeatherData &&
    !isAppWeatherLoading &&
    !weatherError;

  const isCitySelectionRequired = !hasWeatherData;
  const isModalOpen = isCitySearchOpen || shouldForceCitySearch;

  function openCitySearch() {
    setIsCitySearchOpen(true);
  }

  useEffect(() => {
    if (!shouldLoadStoredCity || !storedCity) {
      return;
    }

    const cityToLoad = storedCity;
    let isCancelled = false;

    async function loadInitialWeather() {
      try {
        const weatherData = await getWeatherForecast(cityToLoad);

        if (isCancelled) {
          return;
        }

        setCurrentWeather(weatherData.currentWeather);
        setForecastDays(weatherData.forecastDays);
        setWeatherError(null);
      } catch {
        if (isCancelled) {
          return;
        }

        setCurrentWeather(null);
        setForecastDays([]);
        setWeatherError("Nem sikerült lekérni az időjárási adatokat.");
      }
    }

    void loadInitialWeather();

    return () => {
      isCancelled = true;
    };
  }, [shouldLoadStoredCity, storedCity]);

  const handleSearchCity = useCallback(async (query: string) => {
    const normalizedQuery = query.trim();
    const requestId = ++citySearchRequestIdRef.current;

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

      if (requestId !== citySearchRequestIdRef.current) {
        return;
      }

      setCityResults(cities);
    } catch {
      if (requestId !== citySearchRequestIdRef.current) {
        return;
      }

      setCityResults([]);
      setCitySearchError("Nem sikerült lekérni a városokat.");
    } finally {
      if (requestId === citySearchRequestIdRef.current) {
        setIsCitySearchLoading(false);
      }
    }
  }, []);

  async function handleSelectCity(city: City) {
    setIsCitySearchOpen(false);
    setCityResults([]);
    setCitySearchError(null);
    setWeatherError(null);
    setIsWeatherLoading(true);

    try {
      const weatherData = await getWeatherForecast(city);

      setCurrentWeather(weatherData.currentWeather);
      setForecastDays(weatherData.forecastDays);

      storeCity(city);
      window.dispatchEvent(new Event("weather-city-change"));
    } catch {
      setCurrentWeather(null);
      setForecastDays([]);
      setWeatherError("Nem sikerült lekérni az időjárási adatokat.");
      setIsCitySearchOpen(true);
    } finally {
      setIsWeatherLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen px-[37px] pt-[52px] pb-[10px] text-white sm:px-12 lg:px-8 lg:pt-[96px] lg:pb-[20px]">
        <div className="mx-auto flex min-h-full w-full max-w-[860px] flex-col lg:min-h-[calc(100vh-116px)]">
          {isAppWeatherLoading && !hasWeatherData ? (
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
              <div className="grid items-start lg:grid-cols-[210px_578px] lg:gap-x-[72px]">
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

          <footer className="mt-auto pb-5 pt-6 text-center text-[16px] font-light tracking-[-0.04em] text-white/80 lg:pb-0 lg:pt-6 lg:text-left">
            Farkas Krisztián
          </footer>
        </div>
      </main>

      <CitySearchModal
        isOpen={isModalOpen}
        isRequired={isCitySelectionRequired}
        cities={cityResults}
        isLoading={isCitySearchLoading}
        errorMessage={citySearchError}
        onClose={() => setIsCitySearchOpen(false)}
        onSearchCity={handleSearchCity}
        onSelectCity={handleSelectCity}
      />
    </>
  );
}