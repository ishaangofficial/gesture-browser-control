"use client";

import { useEffect, useRef } from "react";

type HeroVortexProps = {
  className?: string;
  intensity?: number; // 0.5 to 2
  bgAlpha?: number;   // 0 to 1
};

// Minimal, tasteful vortex inspired background for the hero section.
// Draws a soft dark radial well plus subtle rotating arcs with low alpha.
export default function HeroVortex({ className, intensity = 1, bgAlpha = 0.9 }: HeroVortexProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onResize = () => resize();
    resize();
    window.addEventListener("resize", onResize);

    const render = (t: number) => {
      if (!startTimeRef.current) startTimeRef.current = t;
      const elapsed = (t - startTimeRef.current) / 1000; // seconds

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2.1; // slightly above center like reflect’s hero
      const radius = Math.min(w, h) * 0.52;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Soft radial well (dark center fading to transparent)
      const g = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius);
      g.addColorStop(0, `rgba(0,0,0,${0.65 * bgAlpha})`);
      g.addColorStop(0.6, `rgba(0,0,0,${0.30 * bgAlpha})`);
      g.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.fillStyle = g as any;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle concentric arcs rotating at different speeds
      const rings = 6;
      for (let i = 0; i < rings; i++) {
        const r = radius * (0.25 + (i / rings) * 0.7);
        const speed = (0.15 + i * 0.05) * intensity; // rotation speed
        const angle = elapsed * speed;
        const opacity = 0.05 + (i / rings) * 0.06; // very subtle

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // Draw partial arcs with gaps to get that "swirl" feel
        const segments = 3 + (i % 2);
        for (let s = 0; s < segments; s++) {
          const start = (s / segments) * Math.PI * 2;
          const end = start + Math.PI * (0.22 + (i / rings) * 0.1);
          ctx.arc(0, 0, r, start, end);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Light ring highlight to give depth
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity, bgAlpha]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Subtle vignette for edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 100%)",
        }}
      />
    </div>
  );
}


