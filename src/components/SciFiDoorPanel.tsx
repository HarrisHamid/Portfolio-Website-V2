import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/*
 * Geometry is authored in "ref px" against a panel 266.67 units tall, with the
 * centerline at x = 600 (so the original 1200-wide composition is x 0–1200).
 * Everything is sized in `cqh` (1% of the panel's height), so the center
 * assembly keeps its proportions at any width and the side bays stretch to
 * fill whatever horizontal room is left.
 */

const REF_H = 266.67;
const CENTER = 600;
/** ref px → cqh */
const u = (px: number) => `${((px * 100) / REF_H).toFixed(3)}cqh`;
/** box positioned relative to the centerline (asymmetric center pieces) */
const c = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `calc(50% + ${u(x - CENTER)})`,
  top: u(y),
  width: u(w),
  height: u(h),
});
/** box inside a Half, measured from the centerline (mirrors automatically) */
const hb = (x: number, y: number, w: number, h: number): CSSProperties => ({
  right: u(CENTER - x - w),
  top: u(y),
  width: u(w),
  height: u(h),
});
/** box inside a Half that stretches from the outer edge (+ inset) to x2 */
const stretch = (inset: number, x2: number, y: number, h: number): CSSProperties => ({
  left: u(inset),
  right: u(CENTER - x2),
  top: u(y),
  height: u(h),
});

/* ---------- themes ---------- */

type Theme = "navy" | "brass" | "coral";

/*
 * c0–c8: plate ramp, darkest → brightest.  k0–k4: charcoal for the clamp and
 * rail.  amber / teal: indicator lights.  text / glow: screen type.
 */
const THEMES: Record<Theme, Record<string, string>> = {
  navy: {
    "--c0": "#05080f", "--c1": "#0b1a33", "--c2": "#14284d", "--c3": "#22406c",
    "--c4": "#3b5f8f", "--c5": "#6f8fb8", "--c6": "#9fb6d6", "--c7": "#dfe9f7",
    "--c8": "#f4f8fd",
    "--k0": "#06070a", "--k1": "#111318", "--k2": "#1c1f26", "--k3": "#2d313a", "--k4": "#535a67",
    "--amber": "#f5a524", "--teal": "#3ee0d0",
    "--text": "#ffffff", "--glow": "#9fbee6", "--ember": "255 128 40",
  },
  brass: {
    "--c0": "#0a0705", "--c1": "#17110a", "--c2": "#241b10", "--c3": "#3a2d1b",
    "--c4": "#5c4729", "--c5": "#8a6d42", "--c6": "#b8945a", "--c7": "#e8c988",
    "--c8": "#f8ecd0",
    "--k0": "#090807", "--k1": "#151311", "--k2": "#211e1a", "--k3": "#332f29", "--k4": "#5a5248",
    "--amber": "#f0b94d", "--teal": "#8fd6c9",
    "--text": "#f8ecd0", "--glow": "#f0b94d", "--ember": "240 165 60",
  },
  coral: {
    "--c0": "#070a0b", "--c1": "#0f1619", "--c2": "#18232a", "--c3": "#23323a",
    "--c4": "#34474e", "--c5": "#4f666d", "--c6": "#7a9196", "--c7": "#bfd0d1",
    "--c8": "#eef4f3",
    "--k0": "#050404", "--k1": "#0f0e0e", "--k2": "#1a1918", "--k3": "#2a2928", "--k4": "#4a4846",
    "--amber": "#ff6352", "--teal": "#03aba3",
    "--text": "#fff1ec", "--glow": "#ff6352", "--ember": "255 99 82",
  },
};

const DERIVED: Record<string, string> = {
  "--hl": "color-mix(in srgb, var(--c5) 35%, transparent)",
  "--hl2": "color-mix(in srgb, var(--c6) 45%, transparent)",
};

/* ---------- entrance timing ---------- */

/** open → closing → locked → on */
type Phase = "open" | "closing" | "locked" | "on";

/** How far each door sits back from the centerline while open, as % of the panel width. */
const DOOR_OPEN = 36;
/** Doors sliding shut. */
const CLOSE_MS = 950;
/** Clamps snapping in once the doors meet. */
const CLAMP_MS = 160;
/** Lock beat (thunk + smoke) before the screen powers on. */
const LOCK_MS = 700;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface SciFiDoorPanelProps {
  /** Text shown on the central screen. */
  message?: string;
  /** Type the message out when the panel scrolls into view. Skipped under prefers-reduced-motion. */
  typewriter?: boolean;
  /** Milliseconds per character for the typewriter. */
  typeSpeed?: number;
  /** Colour scheme: the original navy hull, brass, or coral/slate to match the site. */
  theme?: Theme;
  /** Tallest the panel gets, in px. Wider screens stretch the side bays. */
  maxHeight?: number;
  /** Narrowest width:height ratio; below this the panel shrinks instead. */
  minAspect?: number;
  /** Render the top-left Show/Hide UI toggle. */
  showToggle?: boolean;
  /** What the UI toggle does to the panel: fade to 30% or hide entirely. */
  hideMode?: "fade" | "hide";
  /** Decorative serial line under the screen. */
  serial?: string;
  /**
   * Start open and play the elevator-close → lock → smoke → power-on sequence the first
   * time the panel scrolls into view. Skipped under prefers-reduced-motion.
   */
  entrance?: boolean;
  className?: string;
}

/* ---------- shared bits ---------- */

const RECESS =
  "bg-[linear-gradient(180deg,var(--c1),color-mix(in_srgb,var(--c1)_65%,var(--c2))_60%,var(--c1))] " +
  "shadow-[inset_0.55cqh_0.65cqh_1.1cqh_rgba(0,0,0,0.85),inset_-0.3cqh_-0.35cqh_0_var(--hl)]";

const CHARCOAL_BAR =
  "bg-[linear-gradient(180deg,var(--k4)_0%,var(--k3)_16%,var(--k2)_55%,var(--k1)_100%)] " +
  "shadow-[0_0.6cqh_1.1cqh_rgba(0,0,0,0.75),inset_0_-0.3cqh_0_var(--k0)]";

const LED_TEAL =
  "absolute rounded-[0.5cqh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--teal)_35%,white),var(--teal)_55%,color-mix(in_srgb,var(--teal)_70%,black))] " +
  "shadow-[0_0_8px_var(--teal),0_0_3cqh_color-mix(in_srgb,var(--teal)_55%,transparent),inset_0_0_0_0.25cqh_rgba(0,0,0,0.25)] " +
  "animate-signal-pulse motion-reduce:animate-none";

const LED_AMBER =
  "absolute rounded-[0.5cqh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--amber)_35%,white),var(--amber)_55%,color-mix(in_srgb,var(--amber)_65%,black))] " +
  "shadow-[0_0_8px_var(--amber),0_0_3cqh_color-mix(in_srgb,var(--amber)_55%,transparent),inset_0_0_0_0.25cqh_rgba(0,0,0,0.25)] " +
  "animate-signal-pulse motion-reduce:animate-none";

/** Allen (hex-socket) cap screw. Centered on `at.left` / `at.top`. */
function Screw({ at, size = 7, rot = 0 }: { at: CSSProperties; size?: number; rot?: number }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--c8)_0%,var(--c6)_24%,var(--c4)_58%,var(--c1)_100%)] shadow-[0_0.35cqh_0.6cqh_rgba(0,0,0,0.8),0_0_0_0.2cqh_var(--c0)]"
      style={{ width: u(size), height: u(size), ...at }}
    >
      <span
        className="absolute inset-[24%] bg-[linear-gradient(155deg,#000_40%,var(--c3))] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0_50%)]"
        style={{ transform: `rotate(${rot}deg)` }}
      />
    </span>
  );
}

/** SVG flavour of the same screw, for the clamp and top plates. */
function SvgScrew({ cx, cy, r, fill, rot = 0 }: { cx: number; cy: number; r: number; fill: string; rot?: number }) {
  const s = r * 0.52;
  const pts = [0, 60, 120, 180, 240, 300]
    .map((a) => {
      const t = ((a + rot) * Math.PI) / 180;
      return `${(cx + s * Math.cos(t)).toFixed(2)},${(cy + s * Math.sin(t)).toFixed(2)}`;
    })
    .join(" ");
  return (
    <g>
      <circle cx={cx} cy={cy + r * 0.25} r={r} style={{ fill: "#000", opacity: 0.5 }} />
      <circle cx={cx} cy={cy} r={r} style={{ fill: `url(#${fill})`, stroke: "var(--c0)", strokeWidth: r * 0.22 }} />
      <polygon points={pts} style={{ fill: "#000", opacity: 0.88 }} />
    </g>
  );
}

/* ---------- typewriter ---------- */

/** Types `text` out once `start` turns true. */
function useTypewriter(text: string, enabled: boolean, speed: number, start: boolean) {
  const [count, setCount] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setCount(text.length);
      return;
    }
    setCount(0);
    if (!start) return;
    let i = 0;
    let interval: number | undefined;

    // short "boot" pause before the first character lands
    const boot = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) window.clearInterval(interval);
      }, speed);
    }, 350);

    return () => {
      window.clearTimeout(boot);
      window.clearInterval(interval);
    };
  }, [text, enabled, speed, start]);

  return count;
}

/* ---------- pixel smoke ---------- */

/** 4×4 ordered-dither thresholds, 0–1. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

type Puff = {
  x: number; y: number; vx: number; vy: number;
  r0: number; r1: number; delay: number; life: number; strength: number;
};

function hexToRgb(hex: string, fallback: [number, number, number]): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * One-shot puff of dithered, chunky-pixel smoke from the door seam and both
 * clamps. Renders into a low-res canvas that's upscaled with nearest-neighbour.
 */
function PixelSmoke({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const W = host.clientWidth;
    const H = host.clientHeight;
    const pix = Math.max(3, Math.round(H / 48));
    const cols = Math.ceil(W / pix);
    const rows = Math.ceil(H / pix);
    canvas.width = cols;
    canvas.height = rows;

    const css = getComputedStyle(canvas);
    const shades = [
      hexToRgb(css.getPropertyValue("--c5"), [79, 102, 109]),
      hexToRgb(css.getPropertyValue("--c6"), [122, 145, 150]),
      hexToRgb(css.getPropertyValue("--c7"), [191, 208, 209]),
    ];

    // all puff geometry below is in low-res pixel units
    const S = H / REF_H / pix; // ref px → low-res px
    const cx = cols / 2;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const puffs: Puff[] = [];

    // seam: a curtain of smoke squeezed out along the centerline
    for (let i = 0; i < 32; i++) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      puffs.push({
        x: cx + rand(-1, 1), y: rand(0.05, 0.95) * rows,
        vx: dir * rand(8, 30), vy: -rand(2, 10),
        r0: rows * rand(0.03, 0.06), r1: rows * rand(0.1, 0.2),
        delay: rand(0, 0.14), life: rand(0.8, 1.35), strength: rand(0.5, 0.85),
      });
    }
    // clamps: short jets venting outward where the jaws bite the housing
    for (const side of [-1, 1]) {
      for (let i = 0; i < 9; i++) {
        puffs.push({
          x: cx + side * 305 * S, y: 133 * S + rand(-6, 6) * S,
          vx: side * rand(10, 30), vy: -rand(4, 14),
          r0: rows * rand(0.03, 0.05), r1: rows * rand(0.08, 0.16),
          delay: rand(0.02, 0.2), life: rand(0.7, 1.15), strength: rand(0.5, 0.85),
        });
      }
    }

    const density = new Float32Array(cols * rows);
    const img = ctx.createImageData(cols, rows);
    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      density.fill(0);
      let alive = false;

      for (const p of puffs) {
        const age = t - p.delay;
        if (age < 0) { alive = true; continue; }
        const k = age / p.life;
        if (k >= 1) continue;
        alive = true;
        // drag on the outward push, steady upward drift
        const drag = (1 - Math.exp(-2.4 * age)) / 2.4;
        const x = p.x + p.vx * drag;
        const y = p.y + p.vy * age;
        const r = p.r0 + (p.r1 - p.r0) * Math.sqrt(k);
        const fade = p.strength * Math.min(1, k * 10) * Math.pow(1 - k, 1.6);
        const x0 = Math.max(0, Math.floor(x - r * 2));
        const x1 = Math.min(cols - 1, Math.ceil(x + r * 2));
        const y0 = Math.max(0, Math.floor(y - r * 2));
        const y1 = Math.min(rows - 1, Math.ceil(y + r * 2));
        const inv = 1 / (r * r);
        for (let py = y0; py <= y1; py++) {
          const dy = py + 0.5 - y;
          for (let px = x0; px <= x1; px++) {
            const dx = px + 0.5 - x;
            density[py * cols + px] += fade * Math.exp(-(dx * dx + dy * dy) * inv);
          }
        }
      }

      const data = img.data;
      for (let py = 0; py < rows; py++) {
        for (let px = 0; px < cols; px++) {
          const i = py * cols + px;
          const d = density[i];
          const o = i * 4;
          if (d <= 0.08 + BAYER[(py & 3) * 4 + (px & 3)] * 0.55) {
            data[o + 3] = 0;
            continue;
          }
          const level = d > 0.85 ? 2 : d > 0.45 ? 1 : 0;
          const [r, g, b] = shades[level];
          data[o] = r;
          data[o + 1] = g;
          data[o + 2] = b;
          data[o + 3] = [140, 190, 225][level];
        }
      }
      ctx.putImageData(img, 0, 0);

      if (alive) raf = requestAnimationFrame(frame);
      else doneRef.current();
    };
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full [image-rendering:pixelated]"
    />
  );
}

/* ---------- mirrored half ---------- */

/** Stretchy plating between the outer edge and the access panel. */
function OuterBay() {
  return (
    <div
      className="absolute hidden overflow-hidden [@container(min-aspect-ratio:5.3/1)]:block"
      style={stretch(14, 8, 44, 196)}
    >
      <div className="absolute -inset-[1.1cqh] rounded-[3.2cqh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c4)_60%,var(--c5)),var(--c3)_35%,var(--c2)_75%,var(--c3))]" />
      <div className={`absolute inset-0 rounded-[2.2cqh] ${RECESS}`} />
      {/* repeating plate seams */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_44cqh,var(--c0)_44cqh,var(--c0)_44.5cqh,var(--hl)_44.5cqh,var(--hl)_44.8cqh)]" />
      {/* ribbed band */}
      <div className="absolute inset-x-[3cqh] top-[12%] h-[22%] rounded-[1.2cqh] bg-[repeating-linear-gradient(180deg,#000_0,#000_1.2cqh,var(--c3)_1.2cqh,var(--c3)_2.4cqh)] opacity-70 shadow-[inset_0_0_0_0.3cqh_var(--c0)]" />
      {/* lower inset strip */}
      <div className="absolute inset-x-[3cqh] bottom-[10%] h-[24%] rounded-[1.4cqh] bg-[linear-gradient(180deg,var(--c3),var(--c2)_55%,var(--c1))] shadow-[inset_0_0.3cqh_0_var(--hl2),inset_0_-0.5cqh_0.8cqh_rgba(0,0,0,0.6),0_0.4cqh_1cqh_rgba(0,0,0,0.7)]" />
      <span className={`${LED_AMBER} top-[38%]`} style={{ right: u(14), width: u(8), height: u(8), marginTop: u(-14) }} />
      <Screw at={{ left: u(8), top: "4%" }} rot={12} />
      <Screw at={{ left: `calc(100% - ${u(8)})`, top: "4%" }} rot={40} />
      <Screw at={{ left: u(8), top: "96%" }} rot={25} />
      <Screw at={{ left: `calc(100% - ${u(8)})`, top: "96%" }} rot={5} />
    </div>
  );
}

/** Recessed access panel with vent, service door and lower hatch. */
function AccessPanel() {
  return (
    <div className="absolute" style={hb(30, 44, 205, 196)}>
      <div className="absolute -inset-[1.1cqh] rounded-[3.2cqh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c4)_60%,var(--c5)),var(--c3)_35%,var(--c2)_75%,var(--c3))] shadow-[0_0.9cqh_2.2cqh_rgba(0,0,0,0.6)]" />
      <div className={`absolute inset-0 rounded-[2.2cqh] ${RECESS}`} />

      {/* tall service door on the outer edge */}
      <div className="absolute left-[4%] top-[6%] h-[88%] w-[18%] rounded-[1.6cqh] bg-[linear-gradient(90deg,var(--c2),var(--c3)_45%,color-mix(in_srgb,var(--c2)_60%,var(--c3))_70%,var(--c1))] shadow-[inset_0_0.3cqh_0_var(--hl2),inset_0_-0.45cqh_0.7cqh_rgba(0,0,0,0.6),0_0.35cqh_0.9cqh_rgba(0,0,0,0.6)]">
        <span className="absolute left-1/2 top-[44%] h-[12%] w-[22%] -translate-x-1/2 rounded-full bg-[var(--c0)] shadow-[0_0.25cqh_0_var(--hl)]" />
      </div>

      {/* vent grille */}
      <div className="absolute left-[27%] top-[10%] flex h-[27%] w-[27%] flex-col justify-between rounded-[1.3cqh] bg-[var(--c0)] px-[4%] py-[3.5%] shadow-[inset_0.35cqh_0.45cqh_0.9cqh_rgba(0,0,0,0.9),0_0.25cqh_0_var(--hl)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="block h-[11%] rounded-full bg-[linear-gradient(180deg,#000_0%,var(--c1)_55%,var(--c4)_100%)] opacity-80"
          />
        ))}
      </div>

      {/* lower hatch */}
      <div className="absolute left-[28%] top-[58%] h-[34%] w-[38%] rounded-[1.6cqh] bg-[linear-gradient(180deg,var(--c3),var(--c2)_55%,color-mix(in_srgb,var(--c1)_50%,var(--c2)))] shadow-[inset_0_0.3cqh_0_var(--hl2),inset_0_-0.55cqh_0.9cqh_rgba(0,0,0,0.6),0_0.45cqh_1.1cqh_rgba(0,0,0,0.7)]">
        <span className="absolute left-[10%] right-[10%] top-1/2 h-[0.45cqh] bg-[var(--c0)]/80" />
        <Screw at={{ left: "12%", top: "20%" }} size={5.5} rot={18} />
        <Screw at={{ left: "88%", top: "20%" }} size={5.5} rot={48} />
        <Screw at={{ left: "12%", top: "80%" }} size={5.5} rot={3} />
        <Screw at={{ left: "88%", top: "80%" }} size={5.5} rot={33} />
      </div>

      <Screw at={{ left: "3%", top: "4%" }} rot={10} />
      <Screw at={{ left: "97%", top: "4%" }} rot={35} />
      <Screw at={{ left: "3%", top: "96%" }} rot={22} />
      <Screw at={{ left: "97%", top: "96%" }} rot={50} />
      <Screw at={{ left: "50%", top: "4%" }} size={6} rot={0} />
      <Screw at={{ left: "50%", top: "96%" }} size={6} rot={28} />
    </div>
  );
}

/** Black connector: a rail running in from the outer edge to a stepped clamp gripping the housing. */
function Connector({ uid, side, locked }: { uid: string; side: string; locked: boolean }) {
  const block = `${uid}-clamp-block-${side}`;
  const flare = `${uid}-clamp-flare-${side}`;
  const screw = `${uid}-clamp-screw-${side}`;
  return (
    <>
      {/* rail */}
      <div className={`absolute rounded-[0.4cqh] ${CHARCOAL_BAR}`} style={stretch(22, 178, 124, 10)} />
      <span className="absolute h-[0.4cqh] bg-[var(--k4)] opacity-80" style={stretch(24, 176, 124.6, 0.9)} />
      {/* end cap + clips */}
      <div className={`absolute rounded-[0.7cqh] ${CHARCOAL_BAR}`} style={{ left: u(14), top: u(118), width: u(16), height: u(22) }} />
      {[62, 128].map((x) => (
        <div key={x} className={`absolute rounded-[0.5cqh] ${CHARCOAL_BAR}`} style={hb(x, 119.5, 9, 19)} />
      ))}

      {/* clamp: rides back from the housing until the doors lock, then snaps in */}
      <div
        className="absolute inset-0"
        style={{
          transform: locked ? "none" : `translateX(${u(-14)})`,
          transition: `transform ${CLAMP_MS}ms cubic-bezier(0.3, 1.8, 0.5, 1)`,
        }}
      >
        <svg viewBox="0 0 130 100" className="absolute overflow-visible" style={hb(170, 83, 130, 100)}>
          <defs>
            <linearGradient id={block} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--k4)" }} />
              <stop offset="0.2" style={{ stopColor: "var(--k3)" }} />
              <stop offset="0.75" style={{ stopColor: "var(--k2)" }} />
              <stop offset="1" style={{ stopColor: "var(--k1)" }} />
            </linearGradient>
            <linearGradient id={flare} x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0" style={{ stopColor: "var(--k4)" }} />
              <stop offset="0.3" style={{ stopColor: "var(--k3)" }} />
              <stop offset="0.7" style={{ stopColor: "var(--k2)" }} />
              <stop offset="1" style={{ stopColor: "var(--k0)" }} />
            </linearGradient>
            <radialGradient id={screw} cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" style={{ stopColor: "var(--c8)" }} />
              <stop offset="0.3" style={{ stopColor: "var(--c6)" }} />
              <stop offset="0.65" style={{ stopColor: "var(--c4)" }} />
              <stop offset="1" style={{ stopColor: "var(--c1)" }} />
            </radialGradient>
          </defs>

          {/* drop shadow */}
          <path d="M12 26 H58 L66 34 H80 L130 12 V96 L80 74 H66 L58 82 H12 Z" style={{ fill: "#000", opacity: 0.55 }} />

          {/* rail socket */}
          <rect x="0" y="36" width="16" height="24" rx="2" style={{ fill: "var(--k2)", stroke: "var(--k0)", strokeWidth: 0.8 }} />
          <line x1="1" y1="36.8" x2="15" y2="36.8" style={{ stroke: "var(--k4)", strokeWidth: 0.8 }} />

          {/* main block */}
          <path d="M10 22 H54 L62 30 V70 L54 78 H10 L6 74 V26 Z" style={{ fill: `url(#${block})`, stroke: "var(--k0)", strokeWidth: 1 }} />
          <path d="M10 22.7 H54 L61.4 30" style={{ fill: "none", stroke: "var(--k4)", strokeWidth: 1.1 }} />
          <path d="M22 31 H50 L54 35 V65 L50 69 H22 Z" style={{ fill: "var(--k1)", stroke: "var(--k3)", strokeWidth: 0.7 }} />

          {/* flared jaw */}
          <path d="M60 32 H76 L126 8 Q129 7 129 10 V90 Q129 93 126 92 L76 68 H60 Z" style={{ fill: `url(#${flare})`, stroke: "var(--k0)", strokeWidth: 1 }} />
          <path d="M60 32.7 H76 L125.5 9" style={{ fill: "none", stroke: "var(--k4)", strokeWidth: 1.1 }} />
          <path d="M76 40 H88 L118 25 V75 L88 60 H76 Z" style={{ fill: "var(--k1)", stroke: "var(--k3)", strokeWidth: 0.7 }} />
          <line x1="88" y1="50" x2="117" y2="50" style={{ stroke: "var(--k0)", strokeWidth: 1.2 }} />
          <line x1="88" y1="51.2" x2="117" y2="51.2" style={{ stroke: "var(--k3)", strokeWidth: 0.6 }} />
          <rect x="121" y="12" width="5" height="76" rx="1.5" style={{ fill: "var(--k2)", stroke: "var(--k0)", strokeWidth: 0.6 }} />

          <SvgScrew cx={14} cy={29} r={3.4} fill={screw} rot={15} />
          <SvgScrew cx={14} cy={71} r={3.4} fill={screw} rot={40} />
          <SvgScrew cx={82} cy={36} r={2.6} fill={screw} rot={5} />
          <SvgScrew cx={82} cy={64} r={2.6} fill={screw} rot={30} />
        </svg>

        {/* indicator on the clamp face: amber until locked */}
        <span className={locked ? LED_TEAL : LED_AMBER} style={hb(203, 129, 8, 8)} />
      </div>
    </>
  );
}

function Half({ side, uid, locked }: { side: "left" | "right"; uid: string; locked: boolean }) {
  return (
    <div className={`absolute inset-y-0 w-1/2 ${side === "left" ? "left-0" : "left-1/2 scale-x-[-1]"}`}>
      {/* bright trim in the top band */}
      <span
        className="absolute rounded-full bg-[var(--c7)] shadow-[0_0_1.9cqh_color-mix(in_srgb,var(--c7)_60%,transparent)]"
        style={stretch(46, 218, 25, 3.6)}
      />
      {/* edge seam */}
      <span className="absolute inset-y-0 w-[0.4cqh] bg-[var(--c0)]/80 shadow-[0.25cqh_0_0_var(--hl)]" style={{ left: u(5) }} />

      <OuterBay />
      <AccessPanel />

      {/* status LED above the rail, beside the clamp */}
      <span className={LED_TEAL} style={hb(150, 104, 10, 10)} />

      {/* structural pillar */}
      <div
        className="absolute bg-[linear-gradient(90deg,var(--c1),var(--c4)_25%,var(--c5)_40%,var(--c3)_70%,var(--c1))] shadow-[0_0_1.8cqh_rgba(0,0,0,0.7)]"
        style={hb(222, 0, 22.2, REF_H)}
      >
        <span className="absolute inset-x-[30%] bottom-[2%] top-[2%] rounded-full bg-[var(--c0)]/40" />
        <Screw at={{ left: "50%", top: "8%" }} size={6} rot={20} />
        <Screw at={{ left: "50%", top: "92%" }} size={6} rot={45} />
      </div>

      <Connector uid={uid} side={side} locked={locked} />
    </div>
  );
}

/* ---------- center pieces ---------- */

/** Two angled raised plates across the top of the housing, notched at center. */
function TopPlates({ uid }: { uid: string }) {
  const plate = `${uid}-plate`;
  const screw = `${uid}-plate-screw`;
  const half = (
    <>
      <path
        d="M14 3 H297 V29 H88 L60 47 H20 Q8 47 8 35 V9 Q8 3 14 3 Z"
        style={{ fill: `url(#${plate})`, stroke: "var(--c0)", strokeWidth: 1 }}
      />
      <path d="M14 3.8 H297" style={{ stroke: "var(--c7)", strokeWidth: 1, opacity: 0.7 }} />
      <path d="M88 29 L60 47" style={{ stroke: "var(--c5)", strokeWidth: 0.8, opacity: 0.6 }} />
      <line x1="96" y1="18" x2="290" y2="18" style={{ stroke: "var(--c0)", strokeWidth: 1, opacity: 0.8 }} />
      <line x1="96" y1="19" x2="290" y2="19" style={{ stroke: "var(--c5)", strokeWidth: 0.5, opacity: 0.4 }} />
      {/* bright trim beneath the plate (glow + core) */}
      <line x1="86" y1="40" x2="284" y2="40" strokeLinecap="round" style={{ stroke: "var(--c7)", strokeWidth: 7, opacity: 0.14 }} />
      <line x1="86" y1="40" x2="284" y2="40" strokeLinecap="round" style={{ stroke: "var(--c8)", strokeWidth: 2.6 }} />
      <SvgScrew cx={110} cy={11} r={3} fill={screw} rot={10} />
      <SvgScrew cx={136} cy={11} r={3} fill={screw} rot={38} />
      <SvgScrew cx={24} cy={15} r={2.6} fill={screw} rot={22} />
    </>
  );

  return (
    <svg viewBox="0 0 624 60" className="absolute overflow-visible" style={c(288, 0, 624, 60)}>
      <defs>
        <linearGradient id={plate} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--c5) 70%, var(--c6))" }} />
          <stop offset="0.25" style={{ stopColor: "var(--c4)" }} />
          <stop offset="0.7" style={{ stopColor: "var(--c3)" }} />
          <stop offset="1" style={{ stopColor: "var(--c2)" }} />
        </linearGradient>
        <radialGradient id={screw} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" style={{ stopColor: "var(--c8)" }} />
          <stop offset="0.3" style={{ stopColor: "var(--c6)" }} />
          <stop offset="0.65" style={{ stopColor: "var(--c4)" }} />
          <stop offset="1" style={{ stopColor: "var(--c1)" }} />
        </radialGradient>
      </defs>
      <g>{half}</g>
      <g transform="translate(624 0) scale(-1 1)">{half}</g>
      {/* center notch */}
      <path d="M300 3 H324 V20 L316 27 H308 L300 20 Z" style={{ fill: "var(--c0)", stroke: "var(--c4)", strokeWidth: 0.8 }} />
      <SvgScrew cx={312} cy={12} r={2.8} fill={screw} rot={0} />
    </svg>
  );
}

/** Concentric double "racetrack" frame around the black screen. */
function Racetrack({ uid }: { uid: string }) {
  const ring = `${uid}-ring`;
  return (
    <svg viewBox="0 0 568 124" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id={ring} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--c8)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--c7)" }} />
          <stop offset="1" style={{ stopColor: "var(--c6)" }} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="568" height="124" rx="62" style={{ fill: "var(--c0)" }} />
      <rect x="7" y="7" width="554" height="110" rx="55" style={{ fill: "none", stroke: "var(--c7)", strokeWidth: 14, opacity: 0.1 }} />
      <rect x="7" y="7" width="554" height="110" rx="55" style={{ fill: "none", stroke: `url(#${ring})`, strokeWidth: 7 }} />
      <rect x="21" y="21" width="526" height="82" rx="41" style={{ fill: "none", stroke: "var(--c7)", strokeWidth: 10, opacity: 0.08 }} />
      <rect x="21" y="21" width="526" height="82" rx="41" style={{ fill: "none", stroke: `url(#${ring})`, strokeWidth: 5 }} />
      <rect x="26" y="26" width="516" height="72" rx="36" style={{ fill: "#000" }} />
    </svg>
  );
}

/* ---------- door art ---------- */

interface PanelArtProps {
  uid: string;
  message: string;
  typed: number;
  typing: boolean;
  serial: string;
  locked: boolean;
  screenOn: boolean;
}

/** The full panel composition. Rendered once per door and clipped to that door's half. */
function PanelArt({ uid, message, typed, typing, serial, locked, screenOn }: PanelArtProps) {
  return (
    <>
      {/* ===== base hull ===== */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--c4)_0%,var(--c3)_6%,var(--c2)_16%,var(--c1)_48%,color-mix(in_srgb,var(--c1)_70%,var(--c2))_80%,var(--c1)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[15%] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c4)_60%,var(--c5)),var(--c3)_30%,color-mix(in_srgb,var(--c2)_60%,var(--c3))_80%,var(--c2))] shadow-[inset_0_0.4cqh_0_color-mix(in_srgb,var(--c7)_40%,transparent),0_0.45cqh_0_var(--c0),0_0.75cqh_0_var(--hl)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_22cqh,rgba(0,0,0,0.35)_22cqh,rgba(0,0,0,0.35)_22.4cqh)] opacity-40" />

      {/* ===== mirrored sides: bays, panels, pillars, rail + clamp ===== */}
      <Half side="left" uid={uid} locked={locked} />
      <Half side="right" uid={uid} locked={locked} />

      {/* ===== center housing ===== */}
      <div
        className="absolute rounded-[38cqh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c6)_80%,var(--c7))_0%,color-mix(in_srgb,var(--c4)_60%,var(--c5))_14%,var(--c3)_45%,color-mix(in_srgb,var(--c2)_60%,var(--c3))_80%,color-mix(in_srgb,var(--c4)_60%,var(--c5))_100%)] p-[2cqh] shadow-[0_1.8cqh_5.4cqh_rgba(0,0,0,0.7),0_0_0_0.55cqh_var(--c0)]"
        style={c(280, 10.67, 640, 237.3)}
      >
        <div className="relative h-full w-full rounded-[36cqh] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c3)_80%,var(--c4))_0%,var(--c2)_28%,color-mix(in_srgb,var(--c1)_55%,var(--c2))_65%,var(--c1)_100%)] shadow-[inset_0_1.6cqh_3.2cqh_rgba(0,0,0,0.65),inset_0_-0.9cqh_1.4cqh_var(--hl),inset_0_0_0_0.45cqh_color-mix(in_srgb,var(--c5)_18%,transparent)]" />
      </div>

      {/* housing grooves */}
      <span className="absolute bg-[var(--c0)] shadow-[0_0.3cqh_0_var(--hl)]" style={c(324, 65.3, 552, 1.7)} />
      <span className="absolute bg-[var(--c0)] shadow-[0_0.3cqh_0_var(--hl)]" style={c(342, 201.3, 516, 1.7)} />

      {/* lip around the racetrack recess */}
      <div
        className="absolute rounded-full bg-[linear-gradient(180deg,var(--c0),var(--c1)_50%,var(--c4))] shadow-[0_0.45cqh_0_var(--hl2)]"
        style={c(307.2, 66.1, 585.6, 136)}
      />

      {/* racetrack + screen */}
      <div className="absolute" style={c(316, 72, 568, 124)}>
        <Racetrack uid={uid} />
        <div className="absolute left-[4.58%] top-[21%] flex h-[58%] w-[90.85%] items-center justify-center overflow-hidden rounded-full">
          <span className={screenOn ? "animate-screen-boot motion-reduce:animate-none" : "opacity-0"}>
            <span
              aria-hidden="true"
              className="relative whitespace-nowrap font-terminal text-[14.6cqh] font-bold leading-none tracking-[0.04em] text-[var(--text)] [-webkit-text-stroke:0.13cqh_var(--text)] [text-shadow:0_0_1.6cqh_color-mix(in_srgb,var(--text)_75%,transparent),0_0_5cqh_color-mix(in_srgb,var(--glow)_45%,transparent)] animate-screen-flicker motion-reduce:animate-none"
            >
              {message.slice(0, typed)}
              <span className="relative inline-block w-0">
                {typing && (
                  <span className="absolute bottom-[0.05em] left-[0.04em] h-[0.85em] w-[0.5em] bg-[var(--text)]/90 animate-caret-blink" />
                )}
              </span>
              <span className="invisible">{message.slice(typed)}</span>
            </span>
          </span>
          {/* scanlines + glass sheen */}
          <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.055)_0,rgba(255,255,255,0.055)_1px,transparent_1px,transparent_3px)]" />
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,color-mix(in_srgb,var(--glow)_12%,transparent),transparent_60%)]" />
        </div>
      </div>

      {/* ===== lower housing hardware ===== */}
      <div
        className="absolute rounded-[1.1cqh] bg-[var(--c0)] shadow-[0_0_0_0.45cqh_color-mix(in_srgb,var(--c4)_60%,transparent),0_0.45cqh_0_var(--hl2)]"
        style={c(355.2, 209.3, 86.4, 26.7)}
      >
        <span className="absolute inset-x-[10%] top-[30%] h-[12%] rounded-full bg-[var(--c2)]" />
        <span className="absolute inset-x-[10%] top-[58%] h-[12%] rounded-full bg-[var(--c2)]" />
      </div>

      <span
        className="absolute -translate-y-1/2 whitespace-nowrap font-terminal text-[3.25cqh] uppercase leading-none tracking-[0.18em] text-[var(--c7)]/45"
        style={{ left: `calc(50% + ${u(456 - CENTER)})`, top: u(222.7) }}
      >
        {serial}
      </span>

      <span
        className="absolute rounded-full bg-[var(--c0)] shadow-[0_0_0_0.35cqh_color-mix(in_srgb,var(--c4)_55%,transparent)]"
        style={c(751.2, 214.7, 22.8, 16.5)}
      >
        <span className="absolute left-[25%] right-[25%] top-1/2 h-[0.55cqh] -translate-y-1/2 rounded-full bg-[var(--c7)]/80" />
      </span>

      {/* square indicator lights */}
      <span className={LED_AMBER} style={c(787.8, 214, 18, 18)} />
      <span className={`${LED_TEAL} [animation-delay:1.3s]`} style={c(819, 214, 18, 18)} />

      <Screw at={{ left: `calc(50% + ${u(338.4 - CENTER)})`, top: u(205.3) }} size={9} rot={14} />
      <Screw at={{ left: `calc(50% + ${u(861.6 - CENTER)})`, top: u(205.3) }} size={9} rot={42} />
      <Screw at={{ left: `calc(50% + ${u(588 - CENTER)})`, top: u(58.7) }} size={5.5} rot={8} />
      <Screw at={{ left: `calc(50% + ${u(612 - CENTER)})`, top: u(58.7) }} size={5.5} rot={36} />

      <TopPlates uid={uid} />

      {/* ===== bottom strip ===== */}
      <div className="absolute inset-x-0 bottom-0 h-[6.5%] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c0)_70%,var(--c1)),var(--c0))] shadow-[0_-0.45cqh_0_color-mix(in_srgb,var(--c4)_45%,transparent)]" />
      <div
        className="absolute flex items-center gap-[2.2cqh]"
        style={{ left: `calc(50% + ${u(366 - CENTER)})`, bottom: u(1.6), height: u(13.3) }}
      >
        <span className="h-[60%] w-[7.2cqh] rounded-full border-[0.55cqh] border-[var(--c8)]/30" />
        <span className="aspect-square h-[70%] rounded-[0.4cqh] border-[0.55cqh] border-[var(--c8)]/30" />
        <span className="font-pixel text-[6.75cqh] leading-none tracking-[0.12em] text-[var(--amber)] [text-shadow:0_0_1.8cqh_color-mix(in_srgb,var(--amber)_85%,transparent)]">
          18:40
        </span>
        <span className="flex h-[55%] gap-[0.7cqh]">
          {[1, 1, 0.6, 0.3].map((o, i) => (
            <span
              key={i}
              className="w-[1.6cqh] bg-[var(--amber)] shadow-[0_0_1.4cqh_color-mix(in_srgb,var(--amber)_80%,transparent)]"
              style={{ opacity: o }}
            />
          ))}
        </span>
      </div>

      {/* warm glow bleeding in from below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] bg-[radial-gradient(ellipse_55%_100%_at_50%_100%,rgb(var(--ember)/0.42),rgb(var(--ember)/0.12)_45%,transparent_75%)] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3%] bg-[linear-gradient(0deg,rgb(var(--ember)/0.55),transparent)] mix-blend-screen" />

      {/* ===== worn-metal noise + scratches ===== */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay" aria-hidden="true">
        <filter id={`${uid}-noise`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id={`${uid}-scratch`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.002 0.35" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${uid}-noise)`} />
        <rect width="100%" height="100%" filter={`url(#${uid}-scratch)`} opacity="0.7" />
      </svg>
    </>
  );
}

/* ---------- main component ---------- */

export default function SciFiDoorPanel({
  message = "Inside B2 Block.",
  typewriter = true,
  typeSpeed = 70,
  theme = "navy",
  maxHeight = 270,
  minAspect = 4.6,
  showToggle = true,
  hideMode = "fade",
  serial = "904 160 10 70N 706 1600 B9D9DFC8C8 B70CC 8D0F/",
  entrance = true,
  className = "",
}: SciFiDoorPanelProps) {
  const [uiVisible, setUiVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>(() =>
    entrance && !prefersReducedMotion() ? "open" : "on",
  );
  const [smoking, setSmoking] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const typed = useTypewriter(message, typewriter, typeSpeed, phase === "on");
  const typing = typed < message.length;

  // Play the close → lock → power-on sequence the first time the panel scrolls into view.
  useEffect(() => {
    const el = panelRef.current;
    if (phase !== "open" || !el) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setPhase("closing");
        timers.push(
          window.setTimeout(() => {
            setPhase("locked");
            setSmoking(true);
          }, CLOSE_MS),
          window.setTimeout(() => setPhase("on"), CLOSE_MS + LOCK_MS),
        );
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
    // only the initial "open" mount should arm the observer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOpen = phase === "open";
  const locked = phase === "locked" || phase === "on";
  const screenOn = phase === "on";
  const hiddenState = hideMode === "fade" ? "opacity-30" : "opacity-0 pointer-events-none";
  const artProps = { message, typed, typing, serial, locked, screenOn };

  const door = (side: "left" | "right") => ({
    clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
    transform: isOpen ? `translateX(${side === "left" ? -DOOR_OPEN : DOOR_OPEN}%)` : "none",
    transition: `transform ${CLOSE_MS}ms cubic-bezier(0.55, 0, 0.85, 0.3)`,
  });

  return (
    <div className={`@container w-full ${className}`}>
      <div
        ref={panelRef}
        className="relative isolate w-full select-none overflow-hidden bg-[var(--c0)] [container-type:size]"
        style={
          {
            height: `min(${(100 / minAspect).toFixed(3)}cqw, ${maxHeight}px)`,
            ...THEMES[theme],
            ...DERIVED,
          } as CSSProperties
        }
      >
        <p className="sr-only">{message}</p>
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            uiVisible ? "opacity-100" : hiddenState
          }`}
        >
          <div className={`absolute inset-0 ${phase === "locked" ? "animate-door-thunk" : ""}`}>
            {/* ===== shaft: what shows between the open doors ===== */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_11cqh,color-mix(in_srgb,var(--c2)_80%,transparent)_11cqh,color-mix(in_srgb,var(--c2)_80%,transparent)_11.8cqh)]" />
            <div className="absolute inset-x-0 top-[46%] h-[8%] bg-[linear-gradient(180deg,var(--c1),var(--c2)_50%,var(--c1))] shadow-[0_0_2cqh_rgba(0,0,0,0.8)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[radial-gradient(ellipse_45%_100%_at_50%_100%,rgb(var(--ember)/0.3),transparent_75%)]" />

            {/* ===== the two doors ===== */}
            <div className="absolute inset-0 will-change-transform" style={door("left")}>
              <PanelArt uid={`${uid}L`} {...artProps} />
            </div>
            <div className="absolute inset-0 will-change-transform" style={door("right")}>
              <PanelArt uid={`${uid}R`} {...artProps} />
            </div>

            {/* ===== seam flash on impact ===== */}
            <span
              className={`pointer-events-none absolute inset-y-0 left-1/2 w-[0.8cqh] -translate-x-1/2 bg-[var(--c8)] shadow-[0_0_2cqh_1cqh_color-mix(in_srgb,var(--teal)_60%,transparent)] ${
                phase === "locked" ? "animate-seam-flash" : "opacity-0"
              }`}
            />
          </div>

          {smoking && <PixelSmoke onDone={() => setSmoking(false)} />}
        </div>

        {/* ===== UI toggle ===== */}
        {showToggle && (
          <button
            type="button"
            onClick={() => setUiVisible((v) => !v)}
            aria-pressed={!uiVisible}
            className="absolute left-[2cqh] top-[5%] z-10 rounded-[clamp(3px,1.8cqh,6px)] bg-white/85 px-[clamp(5px,3.6cqh,10px)] py-[clamp(2px,1.35cqh,4px)] text-[clamp(8px,4cqh,12px)] leading-tight text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-colors hover:bg-white hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
          >
            {uiVisible ? "Hide UI" : "Show UI"}
          </button>
        )}
      </div>
    </div>
  );
}
