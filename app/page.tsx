"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import LoadingSequence from "@/components/LoadingSequence";
import Hud from "@/components/Hud";
import PlanetPanel from "@/components/PlanetPanel";

// Canvas must be client-only; SSR has no WebGL context.
const SolarSystemScene = dynamic(() => import("@/components/SolarSystemScene"), { ssr: false });

export default function Home() {
  const booted = useAppStore((s) => s.booted);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-void">
      <AnimatePresence>{!booted && <LoadingSequence />}</AnimatePresence>
      {booted && (
        <>
          <SolarSystemScene />
          <Hud />
          <PlanetPanel />
        </>
      )}
    </main>
  );
}
