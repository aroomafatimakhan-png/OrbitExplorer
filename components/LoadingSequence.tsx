"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

const BOOT_LINES = [
  "CALIBRATING SENSOR ARRAY",
  "SYNCING EPHEMERIS DATA",
  "ALIGNING SOLAR REFERENCE FRAME",
  "ESTABLISHING TELEMETRY LINK",
  "SYSTEM READY",
];

export default function LoadingSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const setBooted = useAppStore((s) => s.setBooted);

  // Star streak field, speed tied to simulated "link speed" (progress).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const stars = Array.from({ length: 500 }, () => ({
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      z: Math.random() * window.innerWidth,
    }));

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.fillStyle = "rgba(2,3,6,0.35)";
      ctx!.fillRect(0, 0, w, h);
      const speed = 4 + progress * 0.4;

      for (const s of stars) {
        s.z -= speed;
        if (s.z <= 1) {
          s.x = (Math.random() - 0.5) * w;
          s.y = (Math.random() - 0.5) * h;
          s.z = w;
        }
        const k = 128 / s.z;
        const px = s.x * k + w / 2;
        const py = s.y * k + h / 2;
        if (px < 0 || px >= w || py < 0 || py >= h) continue;
        const prevK = 128 / (s.z + speed);
        const prevX = s.x * prevK + w / 2;
        const prevY = s.y * prevK + h / 2;
        const size = (1 - s.z / w) * 2.2;
        ctx!.strokeStyle = `rgba(200,225,255,${1 - s.z / w})`;
        ctx!.lineWidth = size;
        ctx!.beginPath();
        ctx!.moveTo(prevX, prevY);
        ctx!.lineTo(px, py);
        ctx!.stroke();
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [progress]);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    let raf: number;
    function tick(t: number) {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p * 100);
      setLineIndex(Math.min(BOOT_LINES.length - 1, Math.floor(p * BOOT_LINES.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setBooted(true), 200);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setBooted]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="font-display text-2xl tracking-[0.35em] text-mist text-glow">
          PLANETARY&nbsp;SYSTEM
        </div>
        <div className="w-72 h-px bg-panel-border relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-starlight transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-mono text-xs tracking-[0.2em] text-mist-dim"
          >
            {BOOT_LINES[lineIndex]} · {Math.round(progress)}%
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
