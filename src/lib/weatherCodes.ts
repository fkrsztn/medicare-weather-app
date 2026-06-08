import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";

export const weatherCodeMap = {
  0: {
    label: "Tiszta idő",
    icon: Sun,
  },
  1: {
    label: "Többnyire tiszta",
    icon: CloudSun,
  },
  2: {
    label: "Részben felhős",
    icon: CloudSun,
  },
  3: {
    label: "Borult",
    icon: Cloud,
  },
  45: {
    label: "Köd",
    icon: CloudFog,
  },
  48: {
    label: "Zúzmarás köd",
    icon: CloudFog,
  },
  51: {
    label: "Gyenge szitálás",
    icon: CloudDrizzle,
  },
  53: {
    label: "Szitálás",
    icon: CloudDrizzle,
  },
  55: {
    label: "Erős szitálás",
    icon: CloudDrizzle,
  },
  61: {
    label: "Gyenge eső",
    icon: CloudRain,
  },
  63: {
    label: "Eső",
    icon: CloudRain,
  },
  65: {
    label: "Erős eső",
    icon: CloudRain,
  },
  71: {
    label: "Gyenge havazás",
    icon: CloudSnow,
  },
  73: {
    label: "Havazás",
    icon: CloudSnow,
  },
  75: {
    label: "Erős havazás",
    icon: CloudSnow,
  },
  80: {
    label: "Zápor",
    icon: CloudRain,
  },
  81: {
    label: "Zápor",
    icon: CloudRain,
  },
  82: {
    label: "Erős zápor",
    icon: CloudRain,
  },
  95: {
    label: "Zivatar",
    icon: CloudLightning,
  },
  96: {
    label: "Zivatar jégesővel",
    icon: CloudLightning,
  },
  99: {
    label: "Erős zivatar jégesővel",
    icon: CloudLightning,
  },
} as const;

export function getWeatherCodeData(code: number) {
  return (
    weatherCodeMap[code as keyof typeof weatherCodeMap] ?? {
      label: "Ismeretlen",
      icon: Cloud,
    }
  );
}