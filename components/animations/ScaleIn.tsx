"use client";

import type { ReactNode } from "react";

import { MotionReveal } from "./motion-reveal";

export type ScaleInProps = {
  children: ReactNode;
  delay?: number;
};

export function ScaleIn({ children, delay }: ScaleInProps) {
  return (
    <MotionReveal delay={delay} hidden={{ opacity: 0, scale: 0.96 }}>
      {children}
    </MotionReveal>
  );
}
