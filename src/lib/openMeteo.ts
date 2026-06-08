import type { City, CurrentWeather, ForecastDay } from "@/types/weather";
import { getWeatherCodeData } from "@/lib/weatherCodes";

type OpenMeteoGeocodingResponse = {
  results?: {
    id: number;
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  }[];
};

type OpenMeteoForecastResponse = {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

export async function searchCities(query: string): Promise<City[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const searchParams = new URLSearchParams({
    name: normalizedQuery,
    count: "10",
    language: "hu",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a városokat.");
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;

  return (
    data.results?.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.country ?? "",
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
    })) ?? []
  );
}

export async function getWeatherForecast(city: City): Promise<{
  currentWeather: CurrentWeather;
  forecastDays: ForecastDay[];
}> {
  const searchParams = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: "temperature_2m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni az időjárási adatokat.");
  }

  const data = (await response.json()) as OpenMeteoForecastResponse;

  const currentWeatherCodeData = getWeatherCodeData(data.current.weather_code);

  const currentWeather: CurrentWeather = {
    city: city.name,
    temperature: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    weatherLabel: currentWeatherCodeData.label,
  };

  const forecastDays: ForecastDay[] = data.daily.time.map((date, index) => {
    const weatherCode = data.daily.weather_code[index];
    const weatherCodeData = getWeatherCodeData(weatherCode);

    return {
      id: index + 1,
      dayName: getHungarianDayName(date),
      weatherCode,
      weatherLabel: weatherCodeData.label,
      precipitation:
        data.daily.precipitation_probability_max[index] ?? 0,
      minTemperature: Math.round(data.daily.temperature_2m_min[index]),
      maxTemperature: Math.round(data.daily.temperature_2m_max[index]),
    };
  });

  return {
    currentWeather,
    forecastDays,
  };
}

function getHungarianDayName(date: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    weekday: "long",
  }).format(new Date(date));
}