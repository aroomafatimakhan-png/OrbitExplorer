"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Planet, { SUN_RADIUS } from "./Planet";
import NebulaBackdrop from "./NebulaBackdrop";
import CameraRig from "./CameraRig";
import { PLANETS } from "@/lib/planets";
import { useAppStore } from "@/lib/store";

function Sun() {
  const setSelected = useAppStore((s) => s.setSelectedPlanet);
  return (
    <mesh onClick={(e) => { e.stopPropagation(); setSelected("sun"); }}>
      <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
      <meshBasicMaterial color="#FFD98F" />
      <pointLight color="#FFE9C4" intensity={220} decay={2} distance={400} />
    </mesh>
  );
}

export default function SolarSystemScene() {
  const timeScale = useAppStore((s) => s.timeScale);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Canvas
      camera={{ position: [-18, 7.5, 20], fov: 42, near: 0.1, far: 2000 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      onPointerMissed={() => useAppStore.getState().setSelectedPlanet(null)}
    >
      <color attach="background" args={["#05070d"]} />
      <ambientLight intensity={0.06} />
      <Suspense fallback={null}>
        <NebulaBackdrop />
        <Stars radius={280} depth={70} count={4000} factor={2.2} saturation={0.3} fade speed={0.3} />
        <Sun />
        {PLANETS.map((p, i) => (
          <Planet key={p.id} data={p} index={i} timeScale={timeScale} />
        ))}
      </Suspense>
      <CameraRig />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={4}
        maxDistance={160}
        autoRotate={autoRotate}
        autoRotateSpeed={0.35}
        onStart={() => setAutoRotate(false)}
        makeDefault
      />
    </Canvas>
  );
}
