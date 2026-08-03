"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Hud() {
  const now = useClock();
  const timeScale = useAppStore((s) => s.timeScale);
  const setTimeScale = useAppStore((s) => s.setTimeScale);
  const setSelectedPlanet = useAppStore((s) => s.setSelectedPlanet);

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="font-display tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm text-mist text-glow">
          PLANETARY&nbsp;SYSTEM
        </div>
        <div className="font-mono text-[9px] sm:text-[11px] text-mist-dim tracking-wider text-right">
        {now ? now.toUTCString().slice(17, 25) : "--:--:--"} UTC
        <span className="hidden sm:inline"> · MISSION VIEW</span>
      </div>
      <div className="absolute inset-x-4 top-12 sm:top-14 flex items-center justify-between rounded-md border border-panel-border bg-panel/70 px-4 py-2 text-[9px] sm:text-[10px] tracking-[0.2em] text-mist-dim backdrop-blur-sm shadow-hud">
        <span>MISSION VIEW · ORBITAL NAVIGATION ACTIVE</span>
        <span className="hidden md:inline">TARGET: RESOLVE INNER PLANET TRAJECTORY</span>
      </div>

      <div className="pointer-events-auto absolute top-28 right-4 sm:right-auto sm:top-24 sm:left-6 flex flex-col gap-2 rounded-md border border-panel-border bg-panel/80 px-3 py-2 shadow-hud text-mist text-[10px]">
        <button
          type="button"
          onClick={() => setSelectedPlanet("sun")}
          className="rounded px-3 py-2 bg-starlight/10 text-starlight hover:bg-starlight/20"
        >
          Select Sun
        </button>
        <button
          type="button"
          onClick={() => setSelectedPlanet("mercury")}
          className="rounded px-3 py-2 bg-starlight/10 text-starlight hover:bg-starlight/20"
        >
          Select Mercury
        </button>
      </div>
    </div>

      {/* corner brackets */}
      <div className="hud-corner absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 sm:w-10 sm:h-10" />
      <div className="hud-corner absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rotate-180" />

      {/* time control — pointer-events enabled on this island only */}
      <div className="pointer-events-auto absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 hud-corner bg-panel backdrop-blur-md border border-panel-border rounded-md px-4 py-3 shadow-hud">
        <div className="font-mono text-[10px] tracking-widest text-mist-dim mb-2">
          TIME SCALE · {timeScale.toFixed(1)}×
        </div>
        <input
          type="range"
          min={0}
          max={8}
          step={0.1}
          value={timeScale}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          className="w-full sm:w-40 accent-starlight"
        />
      </div>

      {/* instructions — hidden on small screens where the time control already fills the row */}
      <div className="hidden sm:block pointer-events-none absolute bottom-6 right-6 hud-corner bg-panel backdrop-blur-md border border-panel-border rounded-md px-4 py-3 shadow-hud text-right">
        <div className="font-mono text-[10px] tracking-widest text-mist-dim">
          DRAG TO ROTATE · SCROLL TO ZOOM · CLICK A BODY
        </div>
      </div>
    </div>
  );
}
