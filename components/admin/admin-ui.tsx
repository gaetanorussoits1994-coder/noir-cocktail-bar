import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const panelClass =
  "rounded-card border border-white/10 bg-white/[0.035] shadow-soft backdrop-blur-xl";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-noir-white outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-60";

export const labelClass =
  "mb-2 block text-[0.68rem] font-semibold tracking-[0.16em] text-gold uppercase";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-gold bg-gold px-4 py-2.5 text-sm font-semibold text-background-primary transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-noir-white transition hover:border-gold/40 hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-50";

export const dangerButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-gold uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 break-words font-display text-4xl text-gold-light sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-noir-gray">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function AdminLoading({ label = "Caricamento..." }: { label?: string }) {
  return (
    <div className={cn(panelClass, "p-8 text-center text-sm text-noir-gray")}>
      <span className="mx-auto mb-4 block size-7 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
      {label}
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
      {message}
    </div>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <div className={cn(panelClass, "p-8 text-center text-sm text-noir-gray")}>
      {message}
    </div>
  );
}
