"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MetArtObject } from "@/types/telemetry";
import {
  ExternalLink,
  Info,
  Maximize2,
  Palette,
  RotateCw,
  Sparkles,
  X,
} from "lucide-react";

interface MetArtCardProps {
  initialArt: MetArtObject | null;
}

export const MetArtCard: React.FC<MetArtCardProps> = ({ initialArt }) => {
  const [art, setArt] = useState<MetArtObject | null>(initialArt);
  const [isShuffling, setIsShuffling] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const shuffleArtwork = async () => {
    try {
      setIsShuffling(true);
      setImageLoaded(false);
      const res = await fetch("/api/telemetry?feed=art");
      if (res.ok) {
        const newArt = await res.json();
        setArt(newArt);
      }
    } catch (e) {
      console.error("Shuffle failed:", e);
    } finally {
      setIsShuffling(false);
    }
  };

  if (!art) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 text-center font-mono text-slate-400">
        Loading Curated Artifact...
      </div>
    );
  }

  return (
    <>
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-purple-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Palette className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wider uppercase text-purple-200">
                Met Open-Access Art
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                The Metropolitan Museum of Art
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>OPEN ACCESS</span>
          </div>
        </div>

        {/* Art Image Container */}
        <div className="relative my-4 w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-950/80 border border-white/10 group">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 animate-pulse">
              <Sparkles className="w-8 h-8 text-purple-400/40" />
            </div>
          )}

          <Image
            src={art.primaryImageSmall || art.primaryImage}
            alt={art.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            unoptimized={true}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Lightbox Trigger */}
          <button
            onClick={() => setLightboxOpen(true)}
            title="Expand Full Resolution Lightbox"
            className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 hover:text-white hover:bg-black/80 transition opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Bottom Title overlay */}
          <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
            <p className="text-xs font-semibold text-white truncate drop-shadow-md">
              {art.title}
            </p>
            <p className="text-[11px] font-medium text-purple-300/90 truncate drop-shadow-md">
              {art.artistDisplayName || "Unknown Artisan"} ({art.objectDate})
            </p>
          </div>
        </div>

        {/* Artwork Metadata Details */}
        <div className="space-y-2 text-xs font-mono text-slate-400">
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-slate-500 text-[11px]">Medium:</span>
            <span className="text-slate-200 text-right truncate max-w-[200px]" title={art.medium}>
              {art.medium}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-slate-500 text-[11px]">Department:</span>
            <span className="text-purple-300 text-right truncate max-w-[200px]">
              {art.department}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500 text-[11px]">Accession:</span>
            <span className="text-slate-300">ID #{art.objectID}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <button
            onClick={shuffleArtwork}
            disabled={isShuffling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isShuffling ? "animate-spin text-purple-400" : ""}`}
            />
            <span>{isShuffling ? "Cataloging..." : "Discover Artifact"}</span>
          </button>

          <a
            href={art.objectURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-purple-300 transition"
          >
            <span>Met Archive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center glass-panel rounded-2xl p-4 overflow-hidden border border-purple-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
              <span className="text-purple-300 font-bold">
                {art.title} — {art.artistDisplayName}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[65vh] my-3">
              <Image
                src={art.primaryImage || art.primaryImageSmall}
                alt={art.title}
                fill
                className="object-contain"
                unoptimized={true}
              />
            </div>

            <div className="w-full text-center text-xs text-slate-400 font-mono">
              <p>{art.artistDisplayBio || art.repository}</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {art.dimensions} • {art.medium}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
