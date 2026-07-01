"use client";

import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import type { ReactNode } from "react";

const premiumTransition: Transition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1],
};

type MotionRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  hidden: TargetAndTransition;
};

export function MotionReveal({
  children,
  delay = 0,
  className,
  hidden,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : hidden}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        ...premiumTransition,
        delay: shouldReduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
