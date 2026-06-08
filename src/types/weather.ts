export type ForecastDay = {
  id: number;
  dayName: string;
  weatherCode: number;
  weatherLabel: string;
  precipitation: number;
  minTemperature: number;
  maxTemperature: number;
};

export type CurrentWeather = {
  city: string;
  temperature: number;
  weatherCode: number;
  weatherLabel: string;
};

export type City = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};