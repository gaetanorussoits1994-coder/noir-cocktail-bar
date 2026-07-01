import { Award } from "lucide-react";

export type AwardCardProps = {
  title: string;
  number: string;
};

export function AwardCard({ title, number }: AwardCardProps) {
  return (
    <article className="group flex items-center gap-5 rounded-card border border-border bg-card p-5 shadow-soft backdrop-blur-sm transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-gold/25 sm:p-6">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/5 text-gold">
        <Award aria-hidden="true" size={21} strokeWidth={1.5} />
      </div>

      <div className="min-w-0">
        <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-gold uppercase">
          Recognition {number}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-7 text-gold-light">
          {title}
        </h3>
      </div>
    </article>
  );
}
