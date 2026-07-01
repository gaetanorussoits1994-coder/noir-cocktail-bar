import { cn } from "@/lib/utils";

type SectionTitleProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionTitle({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        isCentered && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {isCentered ? (
        <p className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">
          {label}
        </p>
      ) : (
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-10 bg-gold" />
          <span className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">
            {label}
          </span>
        </div>
      )}

      <h2
        className={cn(
          "break-words font-display leading-none font-medium tracking-[-0.03em] text-gold-light [overflow-wrap:anywhere]",
          isCentered
            ? "mt-5 text-5xl sm:text-6xl"
            : "text-5xl sm:text-6xl lg:text-7xl",
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            isCentered
              ? "mx-auto mt-6 max-w-xl text-sm leading-7 text-noir-gray sm:text-base"
              : "mt-7 max-w-xl text-lg leading-8 text-noir-white sm:text-xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
