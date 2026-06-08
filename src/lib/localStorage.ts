import type { City } from "@/types/weather";

const SELECTED_CITY_STORAGE_KEY = "medicare-weather-selected-city";

export function getStoredCity(): City | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedCity = window.localStorage.getItem(SELECTED_CITY_STORAGE_KEY);

    if (!storedCity) {
      return null;
    }

    return JSON.parse(storedCity) as City;
  } catch {
    return null;
  }
}

export function storeCity(city: City) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      SELECTED_CITY_STORAGE_KEY,
      JSON.stringify(city),
    );
  } catch {
  }
}