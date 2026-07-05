"use client";

import { Check, Copy, Download, QrCode } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { panelClass } from "@/components/admin/admin-ui";
import { useTranslation } from "@/lib/i18n/use-translation";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteQrCard() {
  const { t } = useTranslation();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(siteUrl, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#0b0a08", light: "#f1e8d5" },
    })
      .then((url) => isMounted && setQrDataUrl(url))
      .catch((error) =>
        console.error("[AdminQR] QR generation error:", error),
      );
    return () => {
      isMounted = false;
    };
  }, []);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch (error) {
      console.error("[AdminQR] Copy URL error:", error);
    }
  }

  return (
    <section
      className={cn(
        panelClass,
        "grid gap-6 p-5 sm:p-6 lg:grid-cols-[180px_1fr]",
      )}
    >
      <div className="flex aspect-square w-full max-w-[180px] items-center justify-center overflow-hidden rounded-xl border border-gold/20 bg-[#f1e8d5] p-2">
        {qrDataUrl ? (
          <Image
            alt={t("admin.qrAlt")}
            height={640}
            src={qrDataUrl}
            unoptimized
            width={640}
          />
        ) : (
          <QrCode
            className="animate-pulse text-background-primary/40"
            size={54}
          />
        )}
      </div>
      <div className="min-w-0 self-center">
        <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-gold uppercase">
          QR Code
        </p>
        <h2 className="mt-2 font-display text-3xl text-gold-light">
          {t("admin.shareSite")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-noir-gray">
          {t("admin.shareSiteDescription")}
        </p>
        <p className="mt-4 truncate rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-noir-gray">
          {siteUrl}
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-xs font-semibold text-gold-light transition hover:bg-gold/10"
            onClick={copyUrl}
            type="button"
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            {isCopied ? t("admin.copied") : t("admin.copyUrl")}
          </button>
          <a
            aria-disabled={!qrDataUrl}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-background-primary transition hover:bg-gold-light aria-disabled:pointer-events-none aria-disabled:opacity-50"
            download="noir-cocktail-bar-qr.png"
            href={qrDataUrl || undefined}
          >
            <Download size={14} />
            {t("admin.downloadQr")}
          </a>
        </div>
      </div>
    </section>
  );
}
