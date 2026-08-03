"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Builds the diagonal purple/blue Milky Way band + nebula haze as a canvas
// texture, then wraps it around the scene on a large inverted sphere.
// Cheaper and more art-directable than a volumetric shader for this use.
function makeNebulaTexture() {
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#05060c";
  ctx.fillRect(0, 0, w, h);

  // Diagonal Milky Way band (bottom-left to top-right, matching the reference).
  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.rotate(-0.55);
  const band = ctx.createLinearGradient(0, -260, 0, 260);
  band.addColorStop(0, "rgba(20,20,40,0)");
  band.addColorStop(0.42, "rgba(80,70,140,0.16)");
  band.addColorStop(0.5, "rgba(150,130,200,0.28)");
  band.addColorStop(0.58, "rgba(70,90,160,0.16)");
  band.addColorStop(1, "rgba(20,20,40,0)");
  ctx.fillStyle = band;
  ctx.fillRect(-w, -280, w * 2, 560);
  ctx.restore();

  // Soft nebula blobs in violet / teal / rose, scattered along the band.
  const blobColors = [
    "rgba(124,108,242,0.20)",
    "rgba(90,150,220,0.16)",
    "rgba(200,120,170,0.12)",
    "rgba(255,184,107,0.06)",
  ];
  for (let i = 0; i < 26; i++) {
    const t = i / 26 + (Math.random() - 0.5) * 0.06;
    const bx = t * w * 1.4 - w * 0.2;
    const by = h * 0.5 + Math.sin(t * Math.PI) * 40 + (Math.random() - 0.5) * 220;
    const r = 90 + Math.random() * 220;
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
    const c = blobColors[i % blobColors.length];
    grad.addColorStop(0, c);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fine background stars, denser inside the band.
  for (let i = 0; i < 3200; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.1 + 0.15;
    const brightness = Math.random() * 0.7 + 0.3;
    ctx.fillStyle = `rgba(255,255,255,${brightness})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // A few larger colored stars for depth.
  const starTints = ["#EAF2FF", "#BFD9FF", "#FFE3C2"];
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = starTints[i % starTints.length];
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.6 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function NebulaBackdrop() {
  const texture = useMemo(() => makeNebulaTexture(), []);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[480, 48, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} fog={false} />
    </mesh>
  );
}
