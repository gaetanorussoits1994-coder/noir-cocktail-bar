"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Martini } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CocktailBadges,
  formatCocktailPrice,
  MenuCocktailCard,
  type PublicCocktail,
} from "@/components/cards/menu-cocktail-card";
import { Footer } from "@/components/layout/footer";
import { useReservationModal } from "@/components/providers/reservation-modal-provider";
import { PremiumButton } from "@/components/ui/premium-button";
import {
  getDisplayTags,
  getMenuAllergens,
} from "@/lib/menu-allergens";
import {
  deduplicateMenuItems,
  isMenuItemSlug,
  slugifyMenuValue,
} from "@/lib/menu-items";
import { fallbackMenu } from "@/lib/data/static-content";
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

const fallbackCocktails: PublicCocktail[] = fallbackMenu.flatMap((category) =>
  category.items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: slugifyMenuValue(item.name),
    category: category.name,
    description: item.description || null,
    price: item.price,
    image_url: item.imageUrl,
    ingredients: item.ingredients || null,
    alcohol_level: null,
    tags: item.tags,
    is_featured: item.isFeatured,
    is_available: true,
    display_order: item.sortOrder,
  })),
);

export default function CocktailDetailPage() {
  const params = useParams<{ slug: string }>();
  const { openReservation } = useReservationModal();
  const [cocktail, setCocktail] = useState<PublicCocktail | null>(null);
  const [relatedCocktails, setRelatedCocktails] = useState<
    PublicCocktail[]
  >([]);
  const [status, setStatus] = useState<DetailStatus>("loading");

  useEffect(() => {
    const supabase = getSupabaseClient();
    let isMounted = true;

    setStatus("loading");
    setCocktail(null);
    setRelatedCocktails([]);

    if (!params.slug) {
      setStatus("not-found");
      return;
    }

    async function loadCocktail() {
      let availableCocktails: PublicCocktail[] = [];

      if (supabase) {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true);

        if (!isMounted) return;

        if (error) {
          logCocktailError(error);
        } else {
          availableCocktails = deduplicateMenuItems(
            (data ?? []) as PublicCocktail[],
          );
        }
      }

      const selectedCocktail =
        availableCocktails.find((item) =>
          isMenuItemSlug(item, params.slug),
        ) ||
        fallbackCocktails.find((item) =>
          isMenuItemSlug(item, params.slug),
        );

      if (!selectedCocktail) {
        setStatus("not-found");
        return;
      }

      setCocktail(selectedCocktail);
      const relatedSource =
        availableCocktails.length > 0
          ? availableCocktails
          : fallbackCocktails;

      setRelatedCocktails(
        deduplicateMenuItems(relatedSource)
          .filter(
            (item) =>
              item.id !== selectedCocktail.id &&
              slugifyMenuValue(item.category) ===
                slugifyMenuValue(selectedCocktail.category),
          )
          .sort(
            (first, second) =>
              (first.display_order ?? 0) - (second.display_order ?? 0),
          )
          .slice(0, 3),
      );
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
              Prodotto non trovato
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

  const allergens = getMenuAllergens(cocktail);
  const displayedAllergens =
    allergens.length > 0
      ? allergens
      : cocktail.category.toLocaleLowerCase("it-IT").includes("food")
        ? [{ icon: "ℹ️", label: "Chiedi allo staff" }]
        : [];
  const displayTags = getDisplayTags(cocktail.tags);
  const serviceDetails = [
    { label: "Stile", value: cocktail.product_style },
    { label: "Gradazione", value: cocktail.alcohol_level },
    { label: "Bicchiere consigliato", value: cocktail.glassware },
    { label: "Garnish", value: cocktail.garnish },
    { label: "Tecnica", value: cocktail.preparation_technique },
    { label: "Formato", value: cocktail.serving_format },
    {
      label: "Temperatura di servizio",
      value: cocktail.serving_temperature,
    },
  ].filter((detail) => Boolean(detail.value));

  return (
    <>
      <main className="min-h-screen bg-background-primary pt-20">
        <section className="relative min-h-[62vh] overflow-hidden border-b border-border">
          {cocktail.image_url ? (
            <div
              aria-label={`Prodotto ${cocktail.name}`}
              className="absolute inset-0 bg-cover bg-center"
              role="img"
              style={{
                backgroundImage: `url("${cocktail.image_url}")`,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(200,169,106,0.16),transparent_38%),linear-gradient(145deg,#15110b,#090909_68%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/45 to-black/25" />
          <div className="absolute inset-x-8 top-16 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

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
                Il prodotto
              </p>
              <h2 className="mt-3 font-display text-4xl text-gold-light">
                Identità e carattere
              </h2>
              {cocktail.description && (
                <p className="mt-6 max-w-2xl text-base leading-8 text-noir-gray">
                  {cocktail.description}
                </p>
              )}
              {cocktail.story && (
                <div className="mt-10 border-t border-border pt-8">
                  <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
                    Storia e origine
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-noir-gray sm:text-base">
                    {cocktail.story}
                  </p>
                </div>
              )}
              <CocktailBadges className="mt-7" tags={displayTags} />
              {displayedAllergens.length > 0 && (
                <div className="mt-8">
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-gold uppercase">
                    Allergeni
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {displayedAllergens.map((allergen) => (
                      <span
                        className="rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-xs font-semibold text-gold-light"
                        key={allergen.label}
                      >
                        <span aria-hidden="true">{allergen.icon}</span>{" "}
                        {allergen.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                      Prodotti e ingredienti
                    </dt>
                    <dd className="mt-2 text-sm leading-7 text-noir-gray">
                      {cocktail.ingredients}
                    </dd>
                  </div>
                )}
                {serviceDetails.map((detail) => (
                  <div
                    className="border-t border-border pt-6"
                    key={detail.label}
                  >
                    <dt className="text-[0.62rem] font-semibold tracking-[0.16em] text-gold uppercase">
                      {detail.label}
                    </dt>
                    <dd className="mt-2 text-sm text-noir-white">
                      {detail.value}
                    </dd>
                  </div>
                ))}
                {cocktail.staff_recommendation && (
                  <div className="border-t border-border pt-6">
                    <dt className="text-[0.62rem] font-semibold tracking-[0.16em] text-gold uppercase">
                      Il consiglio dello staff
                    </dt>
                    <dd className="mt-2 text-sm leading-7 text-noir-gray">
                      {cocktail.staff_recommendation}
                    </dd>
                  </div>
                )}
                {cocktail.pairing && (
                  <div className="border-t border-border pt-6">
                    <dt className="text-[0.62rem] font-semibold tracking-[0.16em] text-gold uppercase">
                      Abbinamento consigliato
                    </dt>
                    <dd className="mt-2 text-sm leading-7 text-noir-gray">
                      {cocktail.pairing}
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
              <PremiumButton
                className="mt-3 w-full"
                href="/menu"
                variant="outline"
              >
                <ArrowLeft aria-hidden="true" size={15} />
                Torna al menu
              </PremiumButton>
            </motion.aside>
          </div>
        </section>

        {relatedCocktails.length > 0 && (
          <section className="border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
                Continua l&apos;esperienza
              </p>
              <h2 className="mt-3 font-display text-4xl text-gold-light sm:text-5xl">
                Prodotti correlati
              </h2>
              <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {relatedCocktails.map((relatedCocktail) => (
                  <MenuCocktailCard
                    cocktail={relatedCocktail}
                    key={relatedCocktail.id}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
