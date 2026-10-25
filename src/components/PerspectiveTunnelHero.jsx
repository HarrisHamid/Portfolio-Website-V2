import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";
import habibitechSummit from "../assets/Landing_Photos/optimized/habibitech-summit.jpg";
import graduation from "../assets/Landing_Photos/optimized/graduation.jpg";
import hackathon from "../assets/Landing_Photos/optimized/hackathon.jpg";
import localsentinelDemo from "../assets/Landing_Photos/optimized/localsentinel-demo.jpg";
import marketCooked from "../assets/Landing_Photos/optimized/market-cooked.jpg";
import ocpGlobalSummit from "../assets/Landing_Photos/optimized/ocp-global-summit.jpg";
import awsSummit from "../assets/Landing_Photos/optimized/aws-summit.jpg";
import awsExpo from "../assets/Landing_Photos/optimized/aws-expo.jpg";
import panelDiscussion from "../assets/Landing_Photos/optimized/panel-discussion.jpg";
import ocpSummitPanel from "../assets/Landing_Photos/optimized/ocp-summit-panel.jpg";
import goldenGateBridge from "../assets/Landing_Photos/optimized/golden-gate-bridge.jpg";
import nomadFuturist from "../assets/Landing_Photos/optimized/nomad-futurist.jpg";

const IMAGES = [
  { src: habibitechSummit, title: "HabibiTech Summit" },
  { src: graduation, title: "Graduation" },
  { src: hackathon, title: "Hackathon" },
  { src: localsentinelDemo, title: "LocalSentinel Demo" },
  { src: marketCooked, title: "Is the Market Cooked?" },
  { src: ocpGlobalSummit, title: "OCP Global Summit" },
  { src: awsSummit, title: "AWS Summit" },
  { src: awsExpo, title: "AWS Expo" },
  { src: panelDiscussion, title: "Panel Discussion" },
  { src: ocpSummitPanel, title: "OCP Summit Panel", objectPosition: "15% 30%" },
  { src: goldenGateBridge, title: "Golden Gate Bridge" },
  { src: nomadFuturist, title: "Nomad Futurist" },
];

const TUNNEL_CARDS = IMAGES.map((item, i) => {
  const goldenAngle = i * 137.5 * (Math.PI / 180);
  const radiusFactorX = 0.28 + (i % 3) * 0.08;
  const radiusFactorY = 0.26 + (i % 2) * 0.09;

  return {
    item,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX,
    radiusFactorY,
    rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    index: i,
  };
});

const PARALLAX_SPRING = { stiffness: 60, damping: 25, mass: 0.5 };
const SCROLL_SPRING = { stiffness: 80, damping: 30, restDelta: 0.0001 };

function useCameraParallax(enabled) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function TunnelCard({ card, progress, pointer, total, stage }) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]) => {
    const offsetX = baseX - px * panStrength;
    const offsetY = baseY - py * panStrength;
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
  });

  return (
    <motion.div
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-[#101010] shadow-2xl shadow-black/80 ring-1 ring-white/10 transition-all duration-500 hover:ring-[#00eaff]/70 hover:shadow-[#00eaff]/20">
        <img
          src={card.item.src}
          alt={card.item.title}
          draggable={false}
          style={{ objectPosition: card.item.objectPosition || "center" }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex items-end p-4 sm:p-5">
          <span
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            className="text-xs sm:text-sm tracking-widest uppercase text-white/95 drop-shadow-md"
          >
            {card.item.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PerspectiveTunnelHero({ scrollTargetRef } = {}) {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();

  const [stage, setStage] = useState({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollTargetRef || containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, SCROLL_SPRING);

  const pointer = useCameraParallax(!reduce);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,234,255,0.12)_0%,transparent_70%)]" />

      <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        {TUNNEL_CARDS.map((card, i) => (
          <TunnelCard
            key={i}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={TUNNEL_CARDS.length}
            stage={stage}
          />
        ))}
      </div>
    </div>
  );
}
