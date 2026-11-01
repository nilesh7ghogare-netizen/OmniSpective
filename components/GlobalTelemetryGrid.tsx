"use client";

import React, { useEffect, useState } from "react";
import { ConsolidatedTelemetry } from "@/types/telemetry";
import { TelemetryHeader } from "./TelemetryHeader";
import { TimeAnchorCard } from "./TimeAnchorCard";
import { SeismicPulseCard } from "./SeismicPulseCard";
import { MetArtCard } from "./MetArtCard";
import { WeatherTelemetryCard } from "./WeatherTelemetryCard";
import { AdSenseDispatchCard } from "./AdSenseDispatchCard";
import {
  Activity,
  Compass,
  Cpu,
  Layers,
  Palette,
  Radio,
  Wifi,
} from "lucide-react";

interface GlobalTelemetryGridProps {
  initialData: ConsolidatedTelemetry;
}

export const GlobalTelemetryGrid: React.FC<GlobalTelemetryGridProps> = ({
  initialData,
}) => {
  const [data, setData] = useState<ConsolidatedTelemetry>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextSyncSeconds, setNextSyncSeconds] = useState(60);
  const [activeFilter, setActiveFilter] = useState<"all" | "geo" | "chrono_art">("all");

  // Auto-sync polling loop every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setNextSyncSeconds((prev) => {
        if (prev <= 1) {
          refreshTelemetry();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const refreshTelemetry = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/telemetry");
      if (res.ok) {
        const freshData: ConsolidatedTelemetry = await res.json();
        setData(freshData);
        setNextSyncSeconds(60);
      }
    } catch (e) {
      console.error("Telemetry refresh error:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const quakesCount = data.seismic?.count ?? 0;
  const highestMag = data.seismic?.highestMag ? data.seismic.highestMag.toFixed(1) : "0.0";
  const weatherTemp = data.weather?.current?.temperature_2m ?? "--";
  const windSpeed = data.weather?.current?.wind_speed_10m ?? "--";

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Radiant Background Meshes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-[30%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/10 blur-[160px]" />
        <div className="absolute inset-0 scanlines opacity-40" />
      </div>

      {/* Main Global Telemetry Header */}
      <TelemetryHeader
        status={data.status}
        lastSyncTime={data.syncTimestamp}
        isRefreshing={isRefreshing}
        onRefresh={refreshTelemetry}
        nextSyncSeconds={nextSyncSeconds}
      />

      {/* Telemetry Summary Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 pt-6 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl glass-panel border border-emerald-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Seismic Activity
              </div>
              <div className="text-base font-bold text-white font-mono">
                {quakesCount} Tremors / Peak M{highestMag}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel border border-amber-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Compass className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Atmosphere ({data.weather?.locationName?.split(",")[0] || "Pune"})
              </div>
              <div className="text-base font-bold text-white font-mono">
                {weatherTemp}°C • {windSpeed} km/h
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel border border-purple-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Palette className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Cultural Artifact
              </div>
              <div className="text-base font-bold text-white font-mono truncate max-w-[150px]">
                {data.art?.title || "Curated Open Art"}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Telemetry Synthesis
              </div>
              <div className="text-base font-bold text-cyan-300 font-mono">
                100% Operational
              </div>
            </div>
          </div>
        </div>

        {/* View Filter Switchers */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-xs">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Spectrum Matrix</span>
            </button>
            <button
              onClick={() => setActiveFilter("geo")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "geo"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Geophysical & Weather</span>
            </button>
            <button
              onClick={() => setActiveFilter("chrono_art")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "chrono_art"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Chrono & Art</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Telemetry Nodes: 4 Zero-Config Public APIs</span>
          </div>
        </div>
      </div>

      {/* Responsive Masonry Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-3 gap-6 space-y-6">
          {/* Card 1: Chrono Anchor Ticker */}
          {(activeFilter === "all" || activeFilter === "chrono_art") && (
            <div className="masonry-col">
              <TimeAnchorCard initialData={data.time} />
            </div>
          )}

          {/* Card 2: Seismic Pulse Monitor */}
          {(activeFilter === "all" || activeFilter === "geo") && (
            <div className="masonry-col">
              <SeismicPulseCard data={data.seismic} />
            </div>
          )}

          {/* Slot 1: Google AdSense Structural Dispatch Card */}
          {activeFilter === "all" && (
            <div className="masonry-col">
              <AdSenseDispatchCard
                slotId="8932014571"
                className="hover:border-blue-500/40 transition"
              />
            </div>
          )}

          {/* Card 3: Met Museum Open-Access Art Display */}
          {(activeFilter === "all" || activeFilter === "chrono_art") && (
            <div className="masonry-col">
              <MetArtCard initialArt={data.art} />
            </div>
          )}

          {/* Card 4: Atmospheric Weather Telemetry */}
          {(activeFilter === "all" || activeFilter === "geo") && (
            <div className="masonry-col">
              <WeatherTelemetryCard initialWeather={data.weather} />
            </div>
          )}

          {/* Slot 2: Google AdSense Second Strategic Placement */}
          {activeFilter === "all" && (
            <div className="masonry-col">
              <AdSenseDispatchCard
                slotId="9842103562"
                className="hover:border-blue-500/40 transition"
              />
            </div>
          )}
        </div>
      </main>

      {/* Global Telemetry Footer */}
      <footer className="w-full border-t border-white/5 py-6 px-4 lg:px-8 backdrop-blur-md bg-black/30 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300 font-semibold">OmniSpective</span>
            <span>— Ambient Planetary Telemetry Dashboard</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="https://earthquake.usgs.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition"
            >
              USGS Gov
            </a>
            <a
              href="https://www.metmuseum.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition"
            >
              The Met
            </a>
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition"
            >
              Open-Meteo
            </a>
            <a
              href="http://worldtimeapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition"
            >
              WorldTimeAPI
            </a>
          </div>

          <div className="text-[10px] text-slate-600">
            Deployed on Vercel • Zero-Config Telemetry
          </div>
        </div>
      </footer>
    </div>
  );
};
