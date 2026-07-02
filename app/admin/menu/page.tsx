"use client";

import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { getSupabaseClient } from "@/lib/supabase";
import type {
  MenuCategoryRow,
  MenuItemRow,
} from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type MenuFormState = {
  categoryId: string;
  name: string;
  description: string;
  ingredients: string;
  price: string;
  imageUrl: string;
  tags: string;
  isFeatured: boolean;
  isAvailable: boolean;
  sortOrder: string;
};

const emptyForm: MenuFormState = {
  categoryId: "",
  name: "",
  description: "",
  ingredients: "",
  price: "",
  imageUrl: "",
  tags: "",
  isFeatured: false,
  isAvailable: true,
  sortOrder: "0",
};

const priceFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategoryRow[]>([]);
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState<MenuFormState>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadMenu = useCallback(async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Client Supabase non disponibile.");
      setIsLoading(false);
      return;
    }

    const [categoriesResult, itemsResult] = await Promise.all([
      supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    const queryError = categoriesResult.error || itemsResult.error;

    if (queryError) {
      setError(queryError.message);
    } else {
      const nextCategories = categoriesResult.data ?? [];
      setCategories(nextCategories);
      setItems(itemsResult.data ?? []);
      setForm((current) => ({
        ...current,
        categoryId:
          current.categoryId || nextCategories[0]?.id || "",
      }));
      setError("");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const filteredItems = useMemo(
    () =>
      filterCategory === "all"
        ? items
        : items.filter((item) => item.category_id === filterCategory),
    [filterCategory, items],
  );

  function updateField<Key extends keyof MenuFormState>(
    key: Key,
    value: MenuFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateForm() {
    setEditingId("");
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || "",
    });
    setIsFormOpen(true);
  }

  function openEditForm(item: MenuItemRow) {
    setEditingId(item.id);
    setForm({
      categoryId: item.category_id || categories[0]?.id || "",
      name: item.name,
      description: item.description || "",
      ingredients: item.ingredients || "",
      price: item.price?.toString() || "",
      imageUrl: item.image_url || "",
      tags: item.tags.join(", "),
      isFeatured: item.is_featured,
      isAvailable: item.is_available,
      sortOrder: item.sort_order.toString(),
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;

    if (!form.categoryId) {
      setError("Seleziona una categoria.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = {
      category_id: form.categoryId,
      name: form.name.trim(),
      description: form.description.trim() || null,
      ingredients: form.ingredients.trim() || null,
      price: form.price ? Number(form.price) : null,
      image_url: form.imageUrl.trim() || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      is_featured: form.isFeatured,
      is_available: form.isAvailable,
      sort_order: Number(form.sortOrder) || 0,
    };

    const result = editingId
      ? await supabase
          .from("menu_items")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("menu_items").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    closeForm();
    setIsLoading(true);
    await loadMenu();
  }

  async function deleteItem(id: string) {
    if (!window.confirm("Eliminare definitivamente questa voce menu?")) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setItems((current) => current.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        action={
          <button
            className={primaryButtonClass}
            disabled={categories.length === 0}
            onClick={openCreateForm}
            type="button"
          >
            <Plus size={17} />
            Nuova voce
          </button>
        }
        description="Gestisci cocktail, bottiglie, disponibilità e ordine del menu."
        eyebrow="Food & beverage"
        title="Menu"
      />

      {error && <AdminError message={error} />}

      {isFormOpen && (
        <section className={cn(panelClass, "p-5 sm:p-7")}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-gold uppercase">
                {editingId ? "Modifica" : "Nuova voce"}
              </p>
              <h2 className="mt-2 font-display text-3xl text-gold-light">
                Dettagli menu
              </h2>
            </div>
            <button
              aria-label="Chiudi form"
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
              <span className={labelClass}>Categoria</span>
              <select
                className={inputClass}
                onChange={(event) =>
                  updateField("categoryId", event.target.value)
                }
                required
                value={form.categoryId}
              >
                <option value="">Seleziona categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className={labelClass}>Nome</span>
              <input
                className={inputClass}
                onChange={(event) => updateField("name", event.target.value)}
                required
                value={form.name}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>Descrizione</span>
              <textarea
                className={cn(inputClass, "min-h-24 resize-y")}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                value={form.description}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>Ingredienti</span>
              <textarea
                className={cn(inputClass, "min-h-20 resize-y")}
                onChange={(event) =>
                  updateField("ingredients", event.target.value)
                }
                value={form.ingredients}
              />
            </label>

            <label>
              <span className={labelClass}>Prezzo (€)</span>
              <input
                className={inputClass}
                min="0"
                onChange={(event) => updateField("price", event.target.value)}
                step="0.01"
                type="number"
                value={form.price}
              />
            </label>

            <label>
              <span className={labelClass}>Ordine</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("sortOrder", event.target.value)
                }
                type="number"
                value={form.sortOrder}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>Immagine URL</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("imageUrl", event.target.value)
                }
                placeholder="/images/cocktail.png"
                value={form.imageUrl}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>Tags separati da virgola</span>
              <input
                className={inputClass}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="agrumato, signature, smoky"
                value={form.tags}
              />
            </label>

            <div className="flex flex-wrap gap-6 md:col-span-2">
              <label className="flex items-center gap-3 text-sm text-noir-gray">
                <input
                  checked={form.isFeatured}
                  className="size-4 accent-[#c8a96a]"
                  onChange={(event) =>
                    updateField("isFeatured", event.target.checked)
                  }
                  type="checkbox"
                />
                Featured
              </label>
              <label className="flex items-center gap-3 text-sm text-noir-gray">
                <input
                  checked={form.isAvailable}
                  className="size-4 accent-[#c8a96a]"
                  onChange={(event) =>
                    updateField("isAvailable", event.target.checked)
                  }
                  type="checkbox"
                />
                Disponibile
              </label>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                className={primaryButtonClass}
                disabled={isSaving}
                type="submit"
              >
                <Save size={16} />
                {isSaving ? "Salvataggio..." : "Salva voce"}
              </button>
              <button
                className={secondaryButtonClass}
                onClick={closeForm}
                type="button"
              >
                Annulla
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl text-gold-light">
            Voci menu
          </h2>
          <select
            className={cn(inputClass, "sm:max-w-xs")}
            onChange={(event) => setFilterCategory(event.target.value)}
            value={filterCategory}
          >
            <option value="all">Tutte le categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <AdminLoading label="Caricamento menu..." />
        ) : categories.length === 0 ? (
          <AdminEmpty message="Nessuna categoria disponibile. Esegui il seed della migrazione admin." />
        ) : filteredItems.length === 0 ? (
          <AdminEmpty message="Nessuna voce menu per questo filtro." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredItems.map((item) => (
              <article
                className={cn(panelClass, "overflow-hidden")}
                key={item.id}
              >
                {item.image_url && (
                  <div
                    aria-label={`Immagine ${item.name}`}
                    className="h-40 bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url("${item.image_url}")` }}
                  />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-gold uppercase">
                        {item.category_id
                          ? categoriesById.get(item.category_id)?.name
                          : "Senza categoria"}
                      </p>
                      <h3 className="mt-2 break-words font-display text-2xl text-gold-light">
                        {item.name}
                      </h3>
                    </div>
                    <p className="shrink-0 font-semibold text-gold">
                      {item.price === null
                        ? "—"
                        : priceFormatter.format(item.price)}
                    </p>
                  </div>

                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-noir-gray">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.is_featured && (
                      <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[0.62rem] text-gold uppercase">
                        Featured
                      </span>
                    )}
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[0.62rem] uppercase",
                        item.is_available
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                          : "border-white/10 bg-white/[0.04] text-noir-gray",
                      )}
                    >
                      {item.is_available ? "Disponibile" : "Non disponibile"}
                    </span>
                    {item.tags.map((tag) => (
                      <span
                        className="rounded-full border border-white/10 px-2.5 py-1 text-[0.62rem] text-noir-gray"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                    <button
                      className={secondaryButtonClass}
                      onClick={() => openEditForm(item)}
                      type="button"
                    >
                      <Edit3 size={15} />
                      Modifica
                    </button>
                    <button
                      className={dangerButtonClass}
                      onClick={() => deleteItem(item.id)}
                      type="button"
                    >
                      <Trash2 size={15} />
                      Elimina
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
