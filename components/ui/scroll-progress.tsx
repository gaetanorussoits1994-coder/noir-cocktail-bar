"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        zIndex: 9999,
        pointerEvents: "none",
        backgroundColor: "rgba(200, 169, 106, 0.12)",
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          scaleX: smoothProgress,
          transformOrigin: "0% 50%",
          backgroundColor: "#C8A96A",
          boxShadow: "0 0 12px rgba(200, 169, 106, 0.65)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
