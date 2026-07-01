"use client";

import type { ReactNode } from "react";

import { MotionReveal } from "./motion-reveal";

export type FadeInProps = {
  children: ReactNode;
  delay?: number;
};

export function FadeIn({ children, delay }: FadeInProps) {
  return (
    <MotionReveal delay={delay} hidden={{ opacity: 0 }}>
      {children}
    </MotionReveal>
  );
}
