"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import {
  GalleryCard,
  type GalleryCardProps,
} from "@/components/cards/gallery-card";
import { SectionTitle } from "@/components/ui/section-title";
import { getSupabaseClient } from "@/lib/supabase";

type GalleryImageRow = {
  id: string;
  category: string | null;
  image_url: string;
  alt: string | null;
  aspect_ratio: string | null;
};

type GalleryItem = Pick<
  GalleryCardProps,
  "image" | "alt" | "category" | "aspectRatio"
> & {
  id: string;
};

const validAspectRatios = new Set<
  GalleryCardProps["aspectRatio"]
>(["landscape", "portrait", "square", "tall"]);

function getAspectRatio(
  value: string | null,
): GalleryCardProps["aspectRatio"] {
  if (
    value &&
    validAspectRatios.has(value as GalleryCardProps["aspectRatio"])
  ) {
    return value as GalleryCardProps["aspectRatio"];
  }

  return "landscape";
}

export function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    async function loadGallery(client: SupabaseClient) {
      try {
        const { data, error } = await client
          .from("gallery_images")
          .select(
            "id, category, image_url, alt, aspect_ratio, sort_order",
          )
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (error || !data || !isMounted) {
          return;
        }

        const items = (data as GalleryImageRow[])
          .filter((item) => item.image_url?.trim())
          .map((item) => ({
            id: item.id,
            image: item.image_url.trim(),
            alt: item.alt?.trim() || item.category?.trim() || "Noir Gallery",
            category: item.category?.trim() || "Noir",
            aspectRatio: getAspectRatio(item.aspect_ratio),
          }));

        setGalleryItems(items);
      } catch {
        // La Gallery resta vuota se Supabase non è disponibile.
      }
    }

    void loadGallery(supabase);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="bg-background-secondary px-6 py-24 sm:py-32 lg:px-8"
      id="gallery"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          description="Dettagli, atmosfere e creazioni che raccontano l'essenza delle nostre notti."
          label="Momenti Noir"
          title="Gallery"
        />

        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {galleryItems.map((item, index) => (
            <GalleryCard
              {...item}
              delay={(index % 3) * 0.08}
              key={item.id}
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      </div>

      <Lightbox
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        open={lightboxIndex >= 0}
        slides={galleryItems.map((item) => ({
          src: item.image,
          alt: item.alt,
        }))}
      />
    </section>
  );
}
