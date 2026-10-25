import React, { useEffect, useRef } from "react";

const CELL_SIZE = 13;
const TINT = { r: 255, g: 99, b: 82 };
const TINT_OPACITY = 0.18;
const CONTRAST = 1.15;
const GRAYSCALE = 0.1;
const VIGNETTE_INTENSITY = 0.55;
const BLOOM_INTENSITY = 0.45;
const ANIM_SPEED = 1.0;
const ANIM_INTENSITY = 0.6;

function clamp255(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function drawCover(ctx, img, width, height) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = width / height;
  let dw, dh, dx, dy;
  if (imgRatio > canvasRatio) {
    dh = height;
    dw = dh * imgRatio;
    dx = (width - dw) / 2;
    dy = 0;
  } else {
    dw = width;
    dh = dw / imgRatio;
    dx = 0;
    dy = (height - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

export default function HerbariumBackground({ src }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const img = new Image();
    img.src = src;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let imgData = null;
    let rafId = null;

    const sampleToGrid = () => {
      if (!img.complete || !img.naturalWidth || !width || !height) return;
      sampleCtx.clearRect(0, 0, cols, rows);
      drawCover(sampleCtx, img, cols, rows);
      imgData = sampleCtx.getImageData(0, 0, cols, rows).data;
    };

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      cols = Math.max(1, Math.ceil(width / CELL_SIZE));
      rows = Math.max(1, Math.ceil(height / CELL_SIZE));
      sampleCanvas.width = cols;
      sampleCanvas.height = rows;
      sampleToGrid();
    };

    img.onload = resize;
    window.addEventListener("resize", resize);

    const draw = (time) => {
      if (!imgData || !width || !height) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.filter = "blur(14px) brightness(0.55)";
      drawCover(ctx, img, width, height);
      ctx.restore();

      const t = reduceMotion ? 0 : (time / 1000) * ANIM_SPEED;
      const cx = cols / 2;
      const cy = rows / 2;
      const maxDist = Math.hypot(cx, cy) || 1;

      for (let ry = 0; ry < rows; ry++) {
        for (let rx = 0; rx < cols; rx++) {
          const idx = (ry * cols + rx) * 4;
          if (imgData[idx + 3] < 10) continue;

          let r = imgData[idx];
          let g = imgData[idx + 1];
          let b = imgData[idx + 2];

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          r += (lum - r) * GRAYSCALE;
          g += (lum - g) * GRAYSCALE;
          b += (lum - b) * GRAYSCALE;

          r = (r - 128) * CONTRAST + 128;
          g = (g - 128) * CONTRAST + 128;
          b = (b - 128) * CONTRAST + 128;

          r += (TINT.r - r) * TINT_OPACITY;
          g += (TINT.g - g) * TINT_OPACITY;
          b += (TINT.b - b) * TINT_OPACITY;

          r = clamp255(r);
          g = clamp255(g);
          b = clamp255(b);

          const dist = Math.hypot(rx - cx, ry - cy) / maxDist;
          const ripple = Math.sin(dist * 10 - t * 3) * ANIM_INTENSITY;
          const lumNorm = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const cellScale = Math.max(0.15, Math.min(1, lumNorm + ripple * 0.3));
          const alpha = Math.max(0.1, Math.min(1, lumNorm * 0.9 + 0.1 + ripple * 0.2));

          const size = CELL_SIZE * cellScale;
          const offset = (CELL_SIZE - size) / 2;

          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha.toFixed(3)})`;
          ctx.fillRect(rx * CELL_SIZE + offset, ry * CELL_SIZE + offset, size, size);
        }
      }

      ctx.save();
      ctx.filter = "blur(6px)";
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = BLOOM_INTENSITY * 0.5;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();

      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, `rgba(7,10,11,${VIGNETTE_INTENSITY})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [src]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
