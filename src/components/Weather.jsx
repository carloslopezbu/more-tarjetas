import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SunIcon, WindIcon, DropletIcon, CloudSunIcon, ThermometerIcon } from "lucide-react";
import { weatherApi } from "@/api/weather";

export default function WeatherCard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const result = await weatherApi("Madrid");
      if (result.error) {
        setError(result.message);
      } else {
        setData(result);
      }
    };
    fetchWeather();
  }, ["Madrid"]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const {
    location,
    current: {
      temperature,
      weather_descriptions,
      weather_icons,
      humidity,
      wind_speed,
      wind_dir,
      feelslike,
      pressure,
      uv_index,
      is_day,
    },
  } = data;

  return (
    <Card className="max-w-md mx-auto rounded-2xl shadow-lg p-4 bg-gradient-to-br from-blue-100 to-blue-300">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{location.name}, {location.country}</h2>
            <p className="text-sm text-muted-foreground">{location.localtime}</p>
            <p className="text-lg mt-1 font-medium">{weather_descriptions[0]}</p>
          </div>
          <img src={weather_icons[0]} alt="weather icon" className="w-16 h-16 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <ThermometerIcon className="w-4 h-4" />
            <span>Temp: {temperature}°C (Sensación térmica {feelslike}°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <WindIcon className="w-4 h-4" />
            <span>Viento: {wind_speed} km/h {wind_dir}</span>
          </div>
          <div className="flex items-center gap-2">
            <DropletIcon className="w-4 h-4" />
            <span>Humedad: {humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <SunIcon className="w-4 h-4" />
            <span>UV Index: {uv_index}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{is_day === 'yes' ? '☀️ Día' : '🌙 Noche'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
