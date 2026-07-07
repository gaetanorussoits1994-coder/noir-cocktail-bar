"use client";

import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  dangerButtonClass,
  inputClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/admin/admin-ui";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getSupabaseClient } from "@/lib/supabase";
import type { GalleryImageRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type GalleryFormState = {
  title: string;
  imageUrl: string;
  alt: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: GalleryFormState = {
  title: "",
  imageUrl: "",
  alt: "",
  sortOrder: "0",
  isActive: true,
};

const galleryCopy = {
  it: {
    new: "Nuova immagine", edit: "Modifica immagine", details: "Dettagli gallery",
    description: "Gestisci le immagini mostrate nella gallery pubblica.",
    title: "Gallery", close: "Chiudi form", imageTitle: "Titolo",
    order: "Ordine", imageUrl: "Image URL", alt: "Testo alternativo",
    active: "Immagine attiva", saving: "Salvataggio...", save: "Salva immagine",
    cancel: "Annulla", loading: "Caricamento gallery...", empty: "Nessuna immagine presente.",
    deleteConfirm: "Eliminare definitivamente questa immagine?", imageFallback: "Immagine gallery",
    untitled: "Senza titolo", activeBadge: "Attiva", hiddenBadge: "Nascosta",
    editAction: "Modifica", delete: "Elimina", supabaseUnavailable: "Client Supabase non disponibile.",
  },
  en: {
    new: "New image", edit: "Edit image", details: "Gallery details",
    description: "Manage the images shown in the public gallery.",
    title: "Gallery", close: "Close form", imageTitle: "Title",
    order: "Order", imageUrl: "Image URL", alt: "Alternative text",
    active: "Active image", saving: "Saving...", save: "Save image",
    cancel: "Cancel", loading: "Loading gallery...", empty: "No images found.",
    deleteConfirm: "Permanently delete this image?", imageFallback: "Gallery image",
    untitled: "Untitled", activeBadge: "Active", hiddenBadge: "Hidden",
    editAction: "Edit", delete: "Delete", supabaseUnavailable: "Supabase client is unavailable.",
  },
} as const;

export default function AdminGalleryPage() {
  const { locale } = useTranslation();
  const labels = galleryCopy[locale];
  const [images, setImages] = useState<GalleryImageRow[]>([]);
  const [form, setForm] = useState<GalleryFormState>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadImages = useCallback(async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(labels.supabaseUnavailable);
      setIsLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (queryError) setError(queryError.message);
    else {
      setImages(data ?? []);
      setError("");
    }

    setIsLoading(false);
  }, [labels.supabaseUnavailable]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  function openCreateForm() {
    setEditingId("");
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditForm(image: GalleryImageRow) {
    setEditingId(image.id);
    setForm({
      title: image.title || "",
      imageUrl: image.image_url,
      alt: image.alt || "",
      sortOrder: image.sort_order.toString(),
      isActive: image.is_active,
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingId("");
    setIsFormOpen(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setIsSaving(true);
    setError("");

    const payload = {
      title: form.title.trim() || null,
      image_url: form.imageUrl.trim(),
      alt: form.alt.trim() || null,
      sort_order: Number(form.sortOrder) || 0,
      is_active: form.isActive,
    };

    const result = editingId
      ? await supabase
          .from("gallery_images")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("gallery_images").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    closeForm();
    setIsLoading(true);
    await loadImages();
  }

  async function deleteImage(id: string) {
    if (!window.confirm(labels.deleteConfirm)) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error: deleteError } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (deleteError) setError(deleteError.message);
    else setImages((current) => current.filter((image) => image.id !== id));
  }

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        action={
          <button
            className={primaryButtonClass}
            onClick={openCreateForm}
            type="button"
          >
            <Plus size={17} />
            {labels.new}
          </button>
        }
        description={labels.description}
        eyebrow="Visual archive"
        title={labels.title}
      />

      {error && <AdminError message={error} />}

      {isFormOpen && (
        <section className={cn(panelClass, "p-5 sm:p-7")}>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-gold uppercase">
                {editingId ? labels.edit : labels.new}
              </p>
              <h2 className="mt-2 font-display text-3xl text-gold-light">
                {labels.details}
              </h2>
            </div>
            <button
              aria-label={labels.close}
              className={secondaryButtonClass}
              onClick={closeForm}
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <label>
              <span className={labelClass}>{labels.imageTitle}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                value={form.title}
              />
            </label>

            <label>
              <span className={labelClass}>{labels.order}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: event.target.value,
                  }))
                }
                type="number"
                value={form.sortOrder}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>{labels.imageUrl}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imageUrl: event.target.value,
                  }))
                }
                required
                value={form.imageUrl}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>{labels.alt}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    alt: event.target.value,
                  }))
                }
                value={form.alt}
              />
            </label>

            <label className="flex items-center gap-3 text-sm text-noir-gray md:col-span-2">
              <input
                checked={form.isActive}
                className="size-4 accent-[#c8a96a]"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              {labels.active}
            </label>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                className={primaryButtonClass}
                disabled={isSaving}
                type="submit"
              >
                <Save size={16} />
                {isSaving ? labels.saving : labels.save}
              </button>
              <button
                className={secondaryButtonClass}
                onClick={closeForm}
                type="button"
              >
                {labels.cancel}
              </button>
            </div>
          </form>
        </section>
      )}

      {isLoading ? (
        <AdminLoading label={labels.loading} />
      ) : images.length === 0 ? (
        <AdminEmpty message={labels.empty} />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <article
              className={cn(panelClass, "overflow-hidden")}
              key={image.id}
            >
              <div
                aria-label={image.alt || image.title || labels.imageFallback}
                className="aspect-[4/3] bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url("${image.image_url}")` }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="break-words font-display text-2xl text-gold-light">
                      {image.title || labels.untitled}
                    </h2>
                    <p className="mt-1 break-all text-xs text-noir-gray">
                      {image.image_url}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[0.62rem] uppercase",
                      image.is_active
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                        : "border-white/10 text-noir-gray",
                    )}
                  >
                    {image.is_active ? labels.activeBadge : labels.hiddenBadge}
                  </span>
                </div>

                <p className="mt-3 text-xs text-noir-gray">
                  {labels.order}: {image.sort_order}
                  {image.alt && ` · Alt: ${image.alt}`}
                </p>

                <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                  <button
                    className={secondaryButtonClass}
                    onClick={() => openEditForm(image)}
                    type="button"
                  >
                    <Edit3 size={15} />
                    {labels.editAction}
                  </button>
                  <button
                    className={dangerButtonClass}
                    onClick={() => deleteImage(image.id)}
                    type="button"
                  >
                    <Trash2 size={15} />
                    {labels.delete}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
