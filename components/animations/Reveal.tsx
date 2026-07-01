"use client";

import type { ReactNode } from "react";

import { MotionReveal } from "./motion-reveal";

export type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay, className }: RevealProps) {
  return (
    <MotionReveal
      className={className}
      delay={delay}
      hidden={{ opacity: 0, y: 18, scale: 0.985 }}
    >
      {children}
    </MotionReveal>
  );
}
