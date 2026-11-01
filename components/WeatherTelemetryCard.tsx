"use client";

import React, { useState } from "react";
import { WeatherData } from "@/types/telemetry";
import {
  Compass,
  Gauge,
  MapPin,
  Navigation,
  Thermometer,
  Wind,
} from "lucide-react";

interface WeatherTelemetryCardProps {
  initialWeather: WeatherData | null;
}

const PRESET_LOCATIONS = [
  { name: "Pune, India", lat: 18.52, lon: 73.85 },
  { name: "Tokyo, Japan", lat: 35.68, lon: 139.65 },
  { name: "Reykjavik, Iceland", lat: 64.15, lon: -21.94 },
  { name: "Cairo, Egypt", lat: 30.04, lon: 31.24 },
  { name: "San Francisco, USA", lat: 37.77, lon: -122.42 },
];

export const WeatherTelemetryCard: React.FC<WeatherTelemetryCardProps> = ({
  initialWeather,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather);
  const [isLoading, setIsLoading] = useState(false);
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  const fetchPreset = async (lat: number, lon: number, loc: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/telemetry?feed=weather&lat=${lat}&lon=${lon}&loc=${encodeURIComponent(
          loc
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.error("Failed to fetch weather for preset:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchPreset(
          pos.coords.latitude,
          pos.coords.longitude,
          "Local Coordinates"
        );
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  const tempC = weather?.current?.temperature_2m ?? 0;
  const tempDisplay = useFahrenheit
    ? ((tempC * 9) / 5 + 32).toFixed(1)
    : tempC.toFixed(1);
  const tempUnit = useFahrenheit ? "°F" : "°C";

  const windSpeedKmH = weather?.current?.wind_speed_10m ?? 0;

  // Beaufort scale evaluation
  const getBeaufort = (kmh: number) => {
    if (kmh < 1) return { desc: "Calm", color: "text-emerald-400" };
    if (kmh < 6) return { desc: "Light Air", color: "text-emerald-300" };
    if (kmh < 12) return { desc: "Light Breeze", color: "text-cyan-400" };
    if (kmh < 20) return { desc: "Gentle Breeze", color: "text-cyan-300" };
    if (kmh < 29) return { desc: "Moderate Breeze", color: "text-amber-300" };
    if (kmh < 39) return { desc: "Fresh Breeze", color: "text-amber-400" };
    if (kmh < 50) return { desc: "Strong Breeze", color: "text-orange-400" };
    return { desc: "Gale Conditions", color: "text-rose-400" };
  };

  const beaufort = getBeaufort(windSpeedKmH);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-amber-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-amber-200">
              Atmospheric Telemetry
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Open-Meteo High-Resolution Model
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>ISOBARIC SYNC</span>
        </div>
      </div>

      {/* Location Bar */}
      <div className="my-4 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold">{weather?.locationName || "Pune, India"}</span>
        </div>
        <div className="text-[10px] text-slate-500">
          {weather?.latitude.toFixed(2)}°N, {weather?.longitude.toFixed(2)}°E
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Temperature Box */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>Ambient Temp</span>
            </span>
            <button
              onClick={() => setUseFahrenheit(!useFahrenheit)}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              {useFahrenheit ? "°C" : "°F"}
            </button>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              {tempDisplay}
            </span>
            <span className="text-sm font-semibold text-amber-300 font-mono">
              {tempUnit}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Elevation: {weather?.elevation ?? 0}m
          </div>
        </div>

        {/* Wind Speed Box */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>10m Wind Vector</span>
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              {windSpeedKmH.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-cyan-300 font-mono">
              km/h
            </span>
          </div>
          <div className={`text-[10px] font-mono mt-1 ${beaufort.color}`}>
            {beaufort.desc}
          </div>
        </div>
      </div>

      {/* Atmospheric Flow Compass Graphic */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5 relative">
            <Navigation
              className="w-5 h-5 text-amber-400 transition-transform duration-700"
              style={{
                transform: `rotate(${((windSpeedKmH * 15) % 360)}deg)`,
              }}
            />
          </div>
          <div className="text-xs font-mono">
            <div className="text-slate-300 font-semibold">Boundary Layer Vector</div>
            <div className="text-[10px] text-slate-500">
              Velocity: {(windSpeedKmH / 3.6).toFixed(1)} m/s
            </div>
          </div>
        </div>
        <Gauge className="w-5 h-5 text-slate-600" />
      </div>

      {/* Interactive Location Preset Buttons */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span>Global Telemetry Stations</span>
          <button
            onClick={detectLocation}
            className="text-amber-400 hover:text-amber-300 transition text-[10px] cursor-pointer"
          >
            Detect My GPS
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_LOCATIONS.map((loc) => {
            const isSelected = weather?.locationName === loc.name;
            return (
              <button
                key={loc.name}
                onClick={() => fetchPreset(loc.lat, loc.lon, loc.name)}
                disabled={isLoading}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer border ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-white/[0.02] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {loc.name.split(",")[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
