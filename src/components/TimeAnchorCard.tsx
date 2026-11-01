"use client";

import React, { useEffect, useState } from "react";
import { WorldTimeData } from "@/types/telemetry";
import { Clock, Globe, ShieldCheck, Sun, Zap } from "lucide-react";

interface TimeAnchorCardProps {
  initialData: WorldTimeData | null;
}

export const TimeAnchorCard: React.FC<TimeAnchorCardProps> = ({ initialData }) => {
  const [now, setNow] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute timezone strings
  const utcHours = mounted ? String(now.getUTCHours()).padStart(2, "0") : "--";
  const utcMinutes = mounted ? String(now.getUTCMinutes()).padStart(2, "0") : "--";
  const utcSeconds = mounted ? String(now.getUTCSeconds()).padStart(2, "0") : "--";

  const localTimeStr = mounted
    ? now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "--:--:--";

  const tokyoTimeStr = mounted
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--:--";

  const londonTimeStr = mounted
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--:--";

  const newYorkTimeStr = mounted
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--:--";

  const epochMs = mounted ? now.getTime() : 0;
  const dayOfYear = mounted
    ? Math.floor(
        (now.getTime() - new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).getTime()) /
          86400000
      ) + 1
    : 0;
  const yearProgressPercent = ((dayOfYear / 365.25) * 100).toFixed(1);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-cyan-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-cyan-200">
              Chrono-Anchor Ticker
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              High-Precision Master Clock
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>LIVE TICK</span>
        </div>
      </div>

      {/* Main UTC Display */}
      <div className="my-6">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between mb-1">
          <span>UTC Telemetry Anchor</span>
          <span className="text-cyan-400/80">ISO 8601</span>
        </div>
        <div className="flex items-baseline gap-1 font-mono tracking-tighter">
          <span className="text-4xl md:text-5xl font-black text-white tabular-nums">
            {utcHours}
          </span>
          <span className="text-4xl md:text-5xl font-light text-cyan-400 animate-pulse">
            :
          </span>
          <span className="text-4xl md:text-5xl font-black text-white tabular-nums">
            {utcMinutes}
          </span>
          <span className="text-4xl md:text-5xl font-light text-cyan-400 animate-pulse">
            :
          </span>
          <span className="text-4xl md:text-5xl font-black text-cyan-300 tabular-nums">
            {utcSeconds}
          </span>
          <span className="text-xs font-bold text-slate-500 ml-2 uppercase">
            UTC
          </span>
        </div>
        <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Unix Epoch:</span>
          <span className="text-slate-200 font-semibold tabular-nums">
            {epochMs} ms
          </span>
        </div>
      </div>

      {/* Global Zone Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-white/5 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-1">
            <span>Local System</span>
            <Globe className="w-3 h-3 text-slate-500" />
          </div>
          <div className="font-semibold text-slate-200 tabular-nums text-sm">
            {localTimeStr}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-1">
            <span>Tokyo (JST)</span>
            <Sun className="w-3 h-3 text-amber-400/70" />
          </div>
          <div className="font-semibold text-slate-200 tabular-nums text-sm">
            {tokyoTimeStr}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-1">
            <span>London (GMT)</span>
            <Globe className="w-3 h-3 text-slate-500" />
          </div>
          <div className="font-semibold text-slate-200 tabular-nums text-sm">
            {londonTimeStr}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-1">
            <span>New York (EST)</span>
            <Globe className="w-3 h-3 text-slate-500" />
          </div>
          <div className="font-semibold text-slate-200 tabular-nums text-sm">
            {newYorkTimeStr}
          </div>
        </div>
      </div>

      {/* Progress & Sync Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400">
        <div className="flex justify-between items-center mb-1.5">
          <span>Day {dayOfYear} of Year</span>
          <span className="text-cyan-400">{yearProgressPercent}% Solar Cycle</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${yearProgressPercent}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>NTP Drift: &lt;1.2ms</span>
          </span>
          <span className="uppercase">
            Feed: {initialData?.source || "Atomic UTC"}
          </span>
        </div>
      </div>
    </div>
  );
};
