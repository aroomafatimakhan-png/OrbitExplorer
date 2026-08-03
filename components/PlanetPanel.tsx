"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PLANETS, orbitRadius } from "@/lib/planets";
import { useAppStore } from "@/lib/store";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

const SUN_FACTS = {
  name: "The Sun",
  composition: "G-type main-sequence star — 73% hydrogen, 25% helium",
  temperatureC: "~5,500 (surface) / ~15,000,000 (core)",
  fact: "The Sun accounts for 99.86% of the total mass of the solar system.",
};

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-panel-border/50 py-2">
      <span className="font-mono text-[10px] tracking-widest text-mist-dim">{label}</span>
      <span className="font-mono text-xs text-mist">{value}</span>
    </div>
  );
}

function SizeBar({ size, maxSize }: { size: number; maxSize: number }) {
  const width = Math.min(100, Math.max(12, (size / maxSize) * 100));
  return (
    <div className="mt-2 rounded-full bg-panel-border/30 h-2 overflow-hidden">
      <div className="h-2 rounded-full bg-starlight transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}

export default function PlanetPanel() {
  const selected = useAppStore((s) => s.selectedPlanet);
  const setSelected = useAppStore((s) => s.setSelectedPlanet);
  const planet = PLANETS.find((p) => p.id === selected);
  const selectedIndex = planet ? PLANETS.findIndex((p) => p.id === planet.id) : -1;
  const visualOrbit = planet ? orbitRadius(planet.distanceAu, selectedIndex) : 0;
  const rotationDirection = planet ? (planet.rotationHours < 0 ? "Retrograde" : "Prograde") : "Prograde";
  const isSun = selected === "sun";
  const isDesktop = useIsDesktop();
  const visibleSizeKm = isSun ? 696340 * 2 : planet ? planet.radiusKm * 2 : 0;
  const maxSizeKm = Math.max(...PLANETS.map((p) => p.radiusKm * 2), 696340 * 2);

  const motionProps = isDesktop
    ? { initial: { x: 40, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 40, opacity: 0 } }
    : { initial: { y: 60, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 60, opacity: 0 } };

  return (
    <AnimatePresence>
      {(planet || isSun) && (
        <motion.aside
          {...motionProps}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed z-30 bg-panel backdrop-blur-xl shadow-hud overflow-y-auto
                     inset-x-0 bottom-0 max-h-[75vh] rounded-t-2xl border-t border-panel-border
                     sm:inset-x-auto sm:top-0 sm:right-0 sm:left-auto sm:bottom-0
                     sm:h-full sm:max-h-none sm:w-[380px] sm:rounded-none sm:border-t-0 sm:border-l"
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-panel-border sm:hidden" />
          <div className="p-6 pt-3 sm:pt-6">
            <button
              onClick={() => setSelected(null)}
              className="font-mono text-[10px] tracking-widest text-mist-dim hover:text-starlight transition-colors"
            >
              ✕ CLOSE
            </button>

            <h2 className="font-display text-3xl mt-4 text-mist text-glow">
              {isSun ? SUN_FACTS.name : planet!.name}
            </h2>
            <p className="font-mono text-[10px] tracking-widest text-signal mt-1">
              {isSun ? "STAR · CLASS G2V" : `PLANET · ${planet!.hasRings ? "RINGED" : "TERRESTRIAL/GAS"}`}
            </p>

            <div className="mt-6 space-y-0">
              {isSun ? (
                <>
                  <Row label="TEMPERATURE (°C)" value={SUN_FACTS.temperatureC} />
                  <Row label="COMPOSITION" value={SUN_FACTS.composition} />
                </>
              ) : (
                <>
                  <Row label="RADIUS (KM)" value={planet!.radiusKm.toLocaleString()} />
                  <Row label="DIAMETER (KM)" value={visibleSizeKm.toLocaleString()} />
                  <div className="pt-2">
                    <div className="font-mono text-[10px] tracking-widest text-mist-dim">VISIBLE SIZE</div>
                    <SizeBar size={visibleSizeKm} maxSize={maxSizeKm} />
                  </div>
                  <Row label="DISTANCE (AU)" value={planet!.distanceAu} />
                  <Row label="VISUAL ORBIT" value={`${visualOrbit.toFixed(1)} units`} />
                  <Row label="ORBITAL PERIOD (DAYS)" value={planet!.orbitalPeriodDays.toLocaleString()} />
                  <Row label="ROTATION (HOURS)" value={planet!.rotationHours} />
                  <Row label="ROTATION DIRECTION" value={rotationDirection} />
                  <Row label="AXIAL TILT (°)" value={planet!.axialTiltDeg} />
                  <Row label="RING SYSTEM" value={planet!.hasRings ? "Present" : "None"} />
                  <Row label="MOONS" value={planet!.moons} />
                  <Row label="TEMPERATURE (°C)" value={planet!.temperatureC} />
                  <Row label="COMPOSITION" value={planet!.composition} />
                </>
              )}
            </div>

            <div className="mt-6 rounded-md border border-panel-border p-4">
              <p className="font-mono text-[10px] tracking-widest text-starlight mb-2">FIELD NOTE</p>
              <p className="text-sm text-mist-dim leading-relaxed">
                {isSun ? SUN_FACTS.fact : planet!.fact}
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
