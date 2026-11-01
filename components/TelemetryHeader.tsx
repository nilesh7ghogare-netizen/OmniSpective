"use client";

import React from "react";
import {
  Activity,
  Compass,
  Radio,
  RefreshCw,
  Sparkles,
  Wifi,
} from "lucide-react";

interface TelemetryHeaderProps {
  status: {
    seismic: "online" | "degraded" | "offline";
    art: "online" | "degraded" | "offline";
    time: "online" | "degraded" | "offline";
    weather: "online" | "degraded" | "offline";
  };
  lastSyncTime: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  nextSyncSeconds: number;
}

export const TelemetryHeader: React.FC<TelemetryHeaderProps> = ({
  status,
  lastSyncTime,
  isRefreshing,
  onRefresh,
  nextSyncSeconds,
}) => {
  const allOnline = Object.values(status).every((s) => s === "online");

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#060911]/80 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Branding & Status Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute -inset-0.5 rounded-xl bg-cyan-400/20 blur-sm -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                OmniSpective
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  allOnline ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                }`}
              />
              <span>
                {allOnline
                  ? "Ambient Telemetry Synchronized"
                  : "Telemetry Operating with Partial Mesh"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-500">
                Auto-sync in {nextSyncSeconds}s
              </span>
            </p>
          </div>
        </div>

        {/* Global Feeds Status Pills & Action */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs font-mono">
            <span className="text-slate-500 text-[11px]">FEEDS:</span>
            <span
              title="USGS Seismic Feed"
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                status.seismic === "online"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <Activity className="w-2.5 h-2.5" /> USGS
            </span>
            <span
              title="Metropolitan Museum Collection"
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                status.art === "online"
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" /> MET
            </span>
            <span
              title="World Chrono Anchor"
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                status.time === "online"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <Wifi className="w-2.5 h-2.5" /> TIME
            </span>
            <span
              title="Atmospheric Weather"
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                status.weather === "online"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <Compass className="w-2.5 h-2.5" /> METEO
            </span>
          </div>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`}
            />
            <span>{isRefreshing ? "Syncing..." : "Sync Feeds"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
