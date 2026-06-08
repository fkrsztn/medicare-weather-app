export type ForecastDay = {
  id: number;
  dayName: string;
  weatherLabel: string;
  weatherIcon: string;
  precipitation: number;
  minTemperature: number;
  maxTemperature: number;
};

export type CurrentWeather = {
  city: string;
  temperature: number;
  weatherLabel: string;
};