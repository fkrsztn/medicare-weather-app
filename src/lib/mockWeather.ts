import type { CurrentWeather, ForecastDay } from "@/types/weather";

export const mockCurrentWeather: CurrentWeather = {
  city: "Budapest",
  temperature: 25,
  weatherLabel: "Tiszta idő",
};

export const mockForecastDays: ForecastDay[] = [
  {
    id: 1,
    dayName: "Hétfő",
    weatherLabel: "Eső",
    weatherIcon: "rain",
    precipitation: 56,
    minTemperature: 9,
    maxTemperature: 23,
  },
  {
    id: 2,
    dayName: "Kedd",
    weatherLabel: "Eső",
    weatherIcon: "rain",
    precipitation: 56,
    minTemperature: 9,
    maxTemperature: 23,
  },
  {
    id: 3,
    dayName: "Szerda",
    weatherLabel: "Eső",
    weatherIcon: "rain",
    precipitation: 56,
    minTemperature: 9,
    maxTemperature: 23,
  },
  {
    id: 4,
    dayName: "Csütörtök",
    weatherLabel: "Eső",
    weatherIcon: "rain",
    precipitation: 56,
    minTemperature: 9,
    maxTemperature: 23,
  },
  {
    id: 5,
    dayName: "Péntek",
    weatherLabel: "Eső",
    weatherIcon: "rain",
    precipitation: 56,
    minTemperature: 9,
    maxTemperature: 23,
  },
  {
    id: 6,
    dayName: "Szombat",
    weatherLabel: "Eső",
    weatherIcon: "rain",
    precipitation: 56,
    minTemperature: 9,
    maxTemperature: 23,
  },
  {
    id: 7,
    dayName: "Vasárnap",
    weatherLabel: "Eső",
    weatherIcon: "rain",
    precipitation: 56,
    minTemperature: 9,
    maxTemperature: 23,
  },
];