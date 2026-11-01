"use client";

import React, { useState } from "react";
import { SeismicTelemetry } from "@/types/telemetry";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Radio,
} from "lucide-react";

interface SeismicPulseCardProps {
  data: SeismicTelemetry | null;
}

export const SeismicPulseCard: React.FC<SeismicPulseCardProps> = ({ data }) => {
  const [filterSignificant, setFilterSignificant] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const features = data?.features || [];
  const displayFeatures = filterSignificant
    ? features.filter((f) => (f.properties.mag ?? 0) >= 2.0)
    : features;

  const count = data?.count ?? 0;
  const highestMag = data?.highestMag ? data.highestMag.toFixed(1) : "0.0";
  const avgDepth = data?.avgDepth ? data.avgDepth.toFixed(1) : "0.0";

  const getMagColorClass = (mag: number | null) => {
    if (mag === null || mag < 2.0)
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (mag < 4.0)
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (mag < 6.0)
      return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    return "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.4)]";
  };

  const formatMinutesAgo = (timeMs: number) => {
    const diff = Math.max(0, Math.floor((Date.now() - timeMs) / 60000));
    if (diff === 0) return "Just now";
    return `${diff}m ago`;
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-emerald-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-emerald-200">
              Seismic Pulse Monitor
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              USGS Global Real-Time Feed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>PAST HOUR</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 my-5">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">
            Tremors
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {count}
          </div>
          <div className="text-[9px] font-mono text-emerald-400/80 mt-0.5">
            Active Feed
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">
            Peak Richter
          </div>
          <div className="text-2xl font-black text-amber-300 tabular-nums">
            M {highestMag}
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-0.5">
            Intensity
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">
            Avg Depth
          </div>
          <div className="text-2xl font-black text-slate-200 tabular-nums">
            {avgDepth}
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-0.5">
            Kilometers
          </div>
        </div>
      </div>

      {/* Radar Wave Visualization */}
      <div className="relative h-20 w-full rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-center overflow-hidden mb-4">
        {/* Radar Rings */}
        <div className="absolute w-12 h-12 rounded-full border border-emerald-500/20 animate-ping" />
        <div className="absolute w-24 h-24 rounded-full border border-emerald-500/15" />
        <div className="absolute w-36 h-36 rounded-full border border-emerald-500/10" />
        {/* Sweep line */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-emerald-400 origin-left animate-radar" />
        </div>
        <div className="z-10 flex items-center gap-2 text-xs font-mono text-emerald-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Tectonic Acoustic Wavefront Listening</span>
        </div>
      </div>

      {/* Tremor List Controls */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
        <span className="uppercase text-[11px]">Recent Events ({displayFeatures.length})</span>
        <button
          onClick={() => setFilterSignificant(!filterSignificant)}
          className={`text-[10px] px-2 py-0.5 rounded transition cursor-pointer border ${
            filterSignificant
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
          }`}
        >
          {filterSignificant ? "Showing M≥2.0" : "Filter M≥2.0"}
        </button>
      </div>

      {/* Tremor Events Feed */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {displayFeatures.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-slate-500">
            No seismic anomalies registered within filter parameters.
          </div>
        ) : (
          displayFeatures.slice(0, expanded ? 12 : 3).map((item) => {
            const mag = item.properties.mag;
            const magClass = getMagColorClass(mag);
            const depth = item.geometry.coordinates[2];

            return (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`font-mono font-bold text-xs px-2 py-1 rounded-lg border ${magClass}`}
                  >
                    M{mag !== null ? mag.toFixed(1) : "?"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {item.properties.place || "Unknown Location"}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>{formatMinutesAgo(item.properties.time)}</span>
                      <span>•</span>
                      <span>Depth: {depth.toFixed(1)}km</span>
                    </div>
                  </div>
                </div>
                <a
                  href={item.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View USGS Event Report"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-white/5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })
        )}
      </div>

      {/* Expand/Collapse Toggle */}
      {displayFeatures.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition cursor-pointer"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>View All {displayFeatures.length} Tremors</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
