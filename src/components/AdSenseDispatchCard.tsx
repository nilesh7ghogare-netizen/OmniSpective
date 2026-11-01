"use client";

import React, { useEffect, useRef } from "react";
import { ExternalLink, Radio, Shield } from "lucide-react";

interface AdSenseDispatchCardProps {
  slotId?: string;
  clientId?: string;
  format?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const AdSenseDispatchCard: React.FC<AdSenseDispatchCardProps> = ({
  slotId = "1234567890",
  clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-0000000000000000",
  format = "auto",
  className = "",
}) => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    // Safely attempt AdSense push if script is loaded
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // Ignore adblocker / dev environment push issues gracefully
      console.debug("AdSense push bypassed in current environment:", e);
    }
  }, []);

  const isLiveClientConfigured =
    clientId && clientId !== "ca-pub-0000000000000000";

  return (
    <div
      className={`glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between border border-blue-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Background ambient mesh */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header styled like native telemetry dispatch */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-blue-300 font-mono">
              Sponsored Dispatch
            </h3>
            <p className="text-[9px] font-mono text-slate-500">
              External Partner Telemetry
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.03] border border-white/10 text-[9px] font-mono text-slate-400">
          <Shield className="w-2.5 h-2.5 text-blue-400" />
          <span>AD-SLOT #{slotId.slice(-4)}</span>
        </div>
      </div>

      {/* Real Structural AdSense HTML Container */}
      <div className="my-3 min-h-[140px] flex flex-col justify-center items-center relative rounded-xl bg-slate-950/40 border border-white/5 p-3 text-center">
        {/* The Canonical AdSense Tag */}
        <ins
          ref={adRef}
          className="adsbygoogle w-full block"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* Fallback & Visual Representation for development or empty ad slots */}
        {!isLiveClientConfigured && (
          <div className="flex flex-col items-center justify-center py-4 px-2 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300 font-mono">
                Google AdSense Container Ready
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 max-w-[220px]">
                Native glassmorphic ad slot ready for publisher ID integration.
              </p>
            </div>
            <div className="pt-1">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                ins.adsbygoogle
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>AdSense Placement</span>
        <span className="text-slate-600">OmniSpective Network</span>
      </div>
    </div>
  );
};
