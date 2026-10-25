import React, { useEffect, useRef } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import SciFiDoorPanel from "./SciFiDoorPanel";

const DOOR_SPRING = { stiffness: 140, damping: 26, restDelta: 0.0005 };
/** Pixels of scroll input it takes to shut the doors. */
const CLOSE_DISTANCE = 650;
/** Keep holding the page this long after the lock so the smoke + label get seen. */
const HOLD_MS = 700;
/** Scroll events within this long of real input count as the user, not a nav-link jump. */
const INPUT_WINDOW_MS = 800;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * Holds the page still once the door reaches mid-screen, and spends the user's scroll
 * input on closing it instead. Releases once the doors have locked (or if the user
 * scrolls back up past fully open). Doors skipped over (nav links, scrollbar drag)
 * just latch shut.
 */
function useDoorGate(ref, enabled) {
  const target = useMotionValue(0);
  const progress = useSpring(target, DOOR_SPRING);
  // idle → engaged → holding → done
  const gate = useRef({ mode: "idle", y: 0, lastInput: 0, holdTimer: 0 });

  const onLock = () => {
    const g = gate.current;
    if (g.mode !== "engaged") {
      g.mode = "done";
      return;
    }
    g.mode = "holding";
    g.holdTimer = window.setTimeout(() => {
      g.mode = "done";
    }, HOLD_MS);
  };

  useEffect(() => {
    if (!enabled) return;
    const g = gate.current;
    const rect = () => ref.current?.getBoundingClientRect();
    const mid = () => window.innerHeight / 2;
    const center = (r) => r.top + r.height / 2;

    const engage = () => {
      const r = rect();
      if (!r) return;
      g.mode = "engaged";
      g.y = Math.round(window.scrollY + center(r) - mid());
      window.scrollTo({ top: g.y, behavior: "instant" });
    };

    /** Feed `delta` px of scroll intent through the gate. Returns true if it was consumed. */
    const drive = (delta) => {
      g.lastInput = performance.now();
      if (g.mode === "done") return false;
      if (g.mode === "holding") return true;

      if (g.mode === "idle") {
        const r = rect();
        // only catch downward scrolls that would carry the door's center across mid-screen
        if (!r || delta <= 0 || r.bottom <= 0 || center(r) - delta > mid()) return false;
        engage();
      }

      const next = clamp01(target.get() + delta / CLOSE_DISTANCE);
      if (delta < 0 && target.get() <= 0) {
        g.mode = "idle"; // backed out the top: let the page scroll up again
        return false;
      }
      target.set(next);
      return true;
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      if (drive(e.deltaY * unit)) e.preventDefault();
    };

    let touchY = null;
    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      const y = e.touches[0]?.clientY;
      if (touchY == null || y == null) return;
      const delta = (touchY - y) * 1.3;
      touchY = y;
      if (drive(delta)) e.preventDefault();
    };

    const KEY_DELTA = { ArrowDown: 90, ArrowUp: -90, PageDown: 220, PageUp: -220, " ": 220 };
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      let delta = KEY_DELTA[e.key];
      if (delta == null) return;
      if (e.key === " " && e.shiftKey) delta = -delta;
      if (drive(delta)) e.preventDefault();
    };

    const onScroll = () => {
      if (g.mode === "engaged" || g.mode === "holding") {
        if (Math.abs(window.scrollY - g.y) > 1) window.scrollTo({ top: g.y, behavior: "instant" });
        return;
      }
      if (g.mode !== "idle") return;
      const r = rect();
      if (!r) return;
      if (r.bottom < 0) {
        // went past without stopping (nav link, scrollbar, reload mid-page): latch shut
        g.mode = "done";
        target.set(1);
      } else if (
        performance.now() - g.lastInput < INPUT_WINDOW_MS &&
        center(r) < mid() &&
        center(r) > 0
      ) {
        // momentum carried it past mid-screen between input events: pull back and hold
        engage();
      }
    };

    onScroll();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(g.holdTimer);
    };
  }, [enabled, ref, target]);

  return { progress, onLock };
}

export default function SectionDivider({ label, code }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { progress, onLock } = useDoorGate(ref, !reduce);

  return (
    <div className="section-divider">
      <div ref={ref} className="shadow-[0_30px_70px_rgba(0,0,0,0.65)]">
        <SciFiDoorPanel
          theme="coral"
          message={label}
          serial={code}
          showToggle={false}
          maxHeight={250}
          progress={reduce ? undefined : progress}
          closeAt={0.97}
          onLock={onLock}
        />
      </div>
    </div>
  );
}
