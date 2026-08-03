"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Ring, Trail, Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetData } from "@/lib/planets";
import { useAppStore } from "@/lib/store";

// Visual scale helpers — this layout preserves planet size ratios while keeping the system compact and visible.
const SUN_RADIUS_KM = 696340;
export const SUN_RADIUS = 8;
const RADIUS_SCALE = 0.00018;
const MIN_RADIUS = 0.24;
const MAX_PLANET_RADIUS = 4.2;
const ORBIT_RADII = [6.3, 8.9, 11.6, 15.0, 23.0, 32.0, 40.5, 49.0] as const;
const ORBIT_SPEED_SCALE = 0.045;
const START_ANGLES = [-1.25, -0.95, -0.55, -0.25, 0.35, 0.8, 1.4, 1.85] as const;

export function orbitRadius(distanceAu: number, index: number) {
  return ORBIT_RADII[index] ?? ORBIT_RADII[ORBIT_RADII.length - 1] + index * 4;
}

export default function Planet({
  data,
  index,
  timeScale,
}: {
  data: PlanetData;
  index: number;
  timeScale: number;
}) {
  const pivotRef = useRef<THREE.Group>(null);
  const moonPivotRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const selected = useAppStore((s) => s.selectedPlanet);
  const setSelected = useAppStore((s) => s.setSelectedPlanet);

  const radius = Math.min(MAX_PLANET_RADIUS, Math.max(MIN_RADIUS, data.radiusKm * RADIUS_SCALE));
  const orbit = orbitRadius(data.distanceAu, index);
  const angularSpeed = (2 * Math.PI) / (data.orbitalPeriodDays * ORBIT_SPEED_SCALE);
  const spinSpeed = (2 * Math.PI) / (Math.abs(data.rotationHours) / 6 || 4);
  const initialAngle = useMemo(
    () => START_ANGLES[index] ?? Math.random() * Math.PI * 2,
    [index],
  );
  const moonRadius = Math.max(0.1, radius * 0.38);
  const moonOrbit = radius * 2.2;
  const hasMoon = data.moons > 0;
  const moonSpeed = angularSpeed * 10;

  useFrame((_, delta) => {
    if (pivotRef.current) {
      pivotRef.current.rotation.y += angularSpeed * delta * timeScale;
    }
    if (moonPivotRef.current && hasMoon) {
      moonPivotRef.current.rotation.y += moonSpeed * delta * timeScale;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += spinSpeed * delta * timeScale * Math.sign(data.rotationHours || 1);
    }
  });

  const isSelected = selected === data.id;

  return (
    <group ref={pivotRef} rotation={[0, initialAngle, 0]}>
      {/* orbit path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbit - 0.05, orbit + 0.05, 256]} />
        <meshBasicMaterial
          color={isSelected ? "#8FD9FF" : "#92b3ff"}
          transparent
          opacity={isSelected ? 0.9 : 0.55}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <group position={[orbit, 0, 0]}>
        <mesh
          ref={meshRef}
          rotation-z={THREE.MathUtils.degToRad(data.axialTiltDeg)}
          onClick={(e) => {
            e.stopPropagation();
            setSelected(data.id);
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            color={data.color}
            roughness={0.5}
            metalness={0.08}
            emissive={isSelected ? data.color : "#000000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
          {data.hasRings && (
            <Ring args={[radius * 1.5, radius * 2.4, 64]} rotation={[Math.PI / 2.3, 0, 0]}>
              <meshStandardMaterial color={data.color} transparent opacity={0.36} side={THREE.DoubleSide} />
            </Ring>
          )}
        </mesh>

        {hasMoon && (
          <group ref={moonPivotRef}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[moonOrbit - 0.02, moonOrbit + 0.02, 64]} />
              <meshBasicMaterial color="#d3d9ff" transparent opacity={0.25} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
            <group position={[moonOrbit, 0, 0]}>
              <mesh>
                <sphereGeometry args={[moonRadius, 28, 28]} />
                <meshStandardMaterial color="#c9d4ff" roughness={0.6} metalness={0.02} />
              </mesh>
            </group>
          </group>
        )}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius * 1.8, radius * 2, 48]} />
            <meshBasicMaterial color="#8FD9FF" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}
        <Html
          position={[0, radius + 0.65, 0]}
          center
          distanceFactor={18}
          style={{
            pointerEvents: "none",
            whiteSpace: "nowrap",
            color: isSelected ? "#8FD9FF" : "#E5E7EB",
            fontSize: isSelected ? "12px" : "10px",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            textShadow: "0 0 12px rgba(0,0,0,0.4)",
          }}
          wrapperClass="pointer-events-none"
        >
          <span>{data.name}</span>
        </Html>
      </group>
    </group>
  );
}
