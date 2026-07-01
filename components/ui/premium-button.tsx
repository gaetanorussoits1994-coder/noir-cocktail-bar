import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "inline-flex items-center justify-center rounded-card border border-gold bg-gold px-7 py-3.5 text-sm font-medium text-background-primary shadow-gold transition-colors duration-300 hover:bg-gold-light",
  secondary:
    "inline-flex items-center justify-center rounded-card border border-border bg-card px-7 py-3.5 text-sm font-medium text-noir-white shadow-soft backdrop-blur-sm transition-colors duration-300 hover:border-gold/50 hover:text-gold-light",
  outline:
    "inline-flex items-center gap-3 rounded-card border border-gold px-6 py-3.5 text-sm font-medium text-gold-light transition-colors duration-300 hover:bg-gold hover:text-background-primary",
  link: "inline-flex items-center gap-2 self-start text-xs font-semibold tracking-[0.12em] text-noir-white uppercase transition-colors duration-300 hover:text-gold-light",
};

type PremiumButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: keyof typeof variants;
};

export function PremiumButton({
  className,
  variant = "primary",
  ...props
}: PremiumButtonProps) {
  return <a className={cn(variants[variant], className)} {...props} />;
}
