"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Martini } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CocktailBadges,
  formatCocktailPrice,
  type PublicCocktail,
} from "@/components/cards/menu-cocktail-card";
import { Footer } from "@/components/layout/footer";
import { useReservationModal } from "@/components/providers/reservation-modal-provider";
import { PremiumButton } from "@/components/ui/premium-button";
import { getSupabaseClient } from "@/lib/supabase";

type DetailStatus = "loading" | "ready" | "not-found";

function logCocktailError(error: unknown) {
  const supabaseError = (error ?? {}) as {
    message?: unknown;
    details?: unknown;
    hint?: unknown;
    code?: unknown;
  };

  console.error("[CocktailDetail] Supabase select error", {
    message:
      typeof supabaseError.message === "string"
        ? supabaseError.message
        : "Errore Supabase senza messaggio",
    details: supabaseError.details ?? null,
    hint: supabaseError.hint ?? null,
    code: supabaseError.code ?? null,
  });
}

function createCocktailSlug(slug: string | null | undefined, name = "") {
  return (slug?.trim() || name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CocktailDetailPage() {
  const params = useParams<{ slug: string }>();
  const { openReservation } = useReservationModal();
  const [cocktail, setCocktail] = useState<PublicCocktail | null>(null);
  const [status, setStatus] = useState<DetailStatus>("loading");

  useEffect(() => {
    const supabase = getSupabaseClient();
    let isMounted = true;

    if (!supabase || !params.slug) {
      setStatus("not-found");
      return;
    }

    const client = supabase;

    async function loadCocktail() {
      const requestedSlug = createCocktailSlug(params.slug);
      const selectFields =
        "id, name, slug, category, description, price, image_url, ingredients, alcohol_level, tags, is_featured, is_available, display_order";

      const { data, error } = await client
        .from("menu_items")
        .select(selectFields)
        .eq("slug", requestedSlug)
        .eq("is_available", true)
        .limit(1);

      if (!isMounted) return;

      if (error) {
        logCocktailError(error);
        setStatus("not-found");
        return;
      }

      let selectedCocktail = data?.[0] as PublicCocktail | undefined;

      if (!selectedCocktail) {
        const {
          data: availableCocktails,
          error: fallbackError,
        } = await client
          .from("menu_items")
          .select(selectFields)
          .eq("is_available", true);

        if (!isMounted) return;

        if (fallbackError) {
          logCocktailError(fallbackError);
          setStatus("not-found");
          return;
        }

        selectedCocktail = (
          (availableCocktails ?? []) as PublicCocktail[]
        ).find(
          (item) =>
            createCocktailSlug(item.slug, item.name) === requestedSlug,
        );
      }

      if (!selectedCocktail) {
        setStatus("not-found");
        return;
      }

      setCocktail(selectedCocktail);
      setStatus("ready");
    }

    void loadCocktail();

    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background-primary px-4">
        <div
          aria-label="Caricamento cocktail"
          className="size-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold"
          role="status"
        />
      </main>
    );
  }

  if (status === "not-found" || !cocktail) {
    return (
      <>
        <main className="flex min-h-[80vh] items-center justify-center bg-background-primary px-4 pt-24 text-center">
          <div>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/[0.06] text-gold">
              <Martini aria-hidden="true" size={26} />
            </span>
            <h1 className="mt-6 font-display text-5xl text-gold-light">
              Cocktail non trovato
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-noir-gray">
              Questa creazione non è disponibile oppure il menu è in fase di
              aggiornamento.
            </p>
            <Link
              className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-gold uppercase"
              href="/menu"
            >
              <ArrowLeft size={15} />
              Torna al menu
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background-primary pt-20">
        <section className="relative min-h-[62vh] overflow-hidden border-b border-border">
          {cocktail.image_url ? (
            <motion.div
              animate={{ scale: 1 }}
              aria-label={`Cocktail ${cocktail.name}`}
              className="absolute inset-0 bg-cover bg-center"
              initial={{ scale: 1.04 }}
              role="img"
              style={{
                backgroundImage: `url("${cocktail.image_url}")`,
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(200,169,106,0.22),transparent_42%),linear-gradient(145deg,#18130c,#090909_65%)]">
              <span className="flex size-28 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.06] text-gold">
                <Martini aria-hidden="true" size={44} strokeWidth={1.1} />
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/45 to-black/25" />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-end px-4 py-14 sm:px-6 sm:py-18 lg:px-8"
            initial={{ opacity: 0, y: 28 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            <Link
              className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-semibold tracking-[0.1em] text-noir-white uppercase backdrop-blur-md transition hover:border-gold/40 hover:text-gold"
              href="/menu"
            >
              <ArrowLeft size={14} />
              Menu
            </Link>
            <p className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">
              {cocktail.category}
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="max-w-4xl font-display text-6xl leading-[0.9] text-gold-light sm:text-8xl">
                {cocktail.name}
              </h1>
              <p className="shrink-0 font-display text-3xl text-gold">
                {formatCocktailPrice(cocktail.price)}
              </p>
            </div>
          </motion.div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
                La creazione
              </p>
              <h2 className="mt-3 font-display text-4xl text-gold-light">
                Dentro il bicchiere
              </h2>
              {cocktail.description && (
                <p className="mt-6 max-w-2xl text-base leading-8 text-noir-gray">
                  {cocktail.description}
                </p>
              )}
              <CocktailBadges className="mt-7" tags={cocktail.tags} />
            </motion.div>

            <motion.aside
              className="rounded-card border border-gold/20 bg-card p-6 shadow-gold sm:p-8"
              initial={{ opacity: 0, y: 24 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <dl className="space-y-6">
                {cocktail.ingredients && (
                  <div>
                    <dt className="text-[0.62rem] font-semibold tracking-[0.16em] text-gold uppercase">
                      Ingredienti
                    </dt>
                    <dd className="mt-2 text-sm leading-7 text-noir-gray">
                      {cocktail.ingredients}
                    </dd>
                  </div>
                )}
                {cocktail.alcohol_level && (
                  <div className="border-t border-border pt-6">
                    <dt className="text-[0.62rem] font-semibold tracking-[0.16em] text-gold uppercase">
                      Gradazione
                    </dt>
                    <dd className="mt-2 text-sm text-noir-white">
                      {cocktail.alcohol_level}
                    </dd>
                  </div>
                )}
              </dl>

              <PremiumButton
                className="mt-8 w-full"
                href="#reservation-form"
                onClick={(event) => {
                  event.preventDefault();
                  openReservation();
                }}
              >
                Prenota un tavolo
              </PremiumButton>
            </motion.aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
