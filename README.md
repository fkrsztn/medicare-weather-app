# Medicare Weather App

Ez a projekt a Medicare frontend próba feladatára készült.  
Az alkalmazás egy reszponzív időjárás-előrejelző felület, amely Figma design alapján készült Next.js, TypeScript és Tailwind CSS használatával.

A felhasználó egy városkereső modal segítségével választhat várost. A keresés az Open-Meteo Geocoding API-ra épül, a kiválasztott város koordinátái alapján pedig az Open-Meteo Forecast API szolgáltatja az aktuális időjárási adatokat és a 7 napos előrejelzést.

## Demo

Az alkalmazás Vercelen is elérhető:

https://medicare-weather-app-flame.vercel.app/

## Funkciók

- Városkeresés modal ablakban
- Open-Meteo Geocoding API használata
- Több várostalálat listázása
- Kiválasztott város mentése böngészőben
- Aktuális hőmérséklet és időjárási állapot megjelenítése
- 7 napos időjárás-előrejelzés
- Csapadék valószínűség, minimum és maximum hőmérséklet
- Időjárás ikonok Lucide React segítségével
- Maximum hőmérsékletek megjelenítése diagramon
- Reszponzív mobil és desktop nézet

## Használt technológiák

- Next.js
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- Motion
- Open-Meteo API

## Főbb komponensek

A fő alkalmazáslogikát a `WeatherApp` komponens fogja össze. Ez kezeli a város kiválasztását, az időjárási adatok betöltését, a loading és error állapotokat, valamint a modal megjelenítését.

A `CitySearchModal` komponens felel a városkereső felületért. Itt lehet várost keresni, a találatok közül választani, illetve ez jelenik meg első indításkor is, ha még nincs mentett város.

A `CurrentWeather` komponens az aktuális várost, hőmérsékletet és időjárási állapotot jeleníti meg.

A `ForecastList` és `ForecastItem` komponensek a 7 napos előrejelzést jelenítik meg napi bontásban.

A `TemperatureChart` komponens a napi maximum hőmérsékleteket jeleníti meg diagramon.

Az API-hívások és segédfüggvények a `src/lib` mappában találhatók.

## Lokális futtatás

A projekt futtatásához először telepíteni kell a függőségeket:

```bash
npm install