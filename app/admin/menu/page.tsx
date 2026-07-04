"use client";

import {
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useCallback, useMemo, useState, useEffect } from "react";

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
import type { MenuItemRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type MenuFormState = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  ingredients: string;
  alcoholLevel: string;
  isFeatured: boolean;
  isAvailable: boolean;
  displayOrder: string;
};

const emptyForm: MenuFormState = {
  name: "",
  slug: "",
  category: "Cocktail Signature",
  description: "",
  price: "",
  ingredients: "",
  alcoholLevel: "",
  isFeatured: false,
  isAvailable: true,
  displayOrder: "0",
};

const suggestedCategories = [
  "Cocktail Signature",
  "Cocktail Classici",
  "Aperitivi Noir",
  "Alcolici Premium",
  "Cicchetti / Shottini",
  "Analcolici",
];

const priceFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function logSupabaseError(action: string, error: {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}) {
  console.error(`[AdminMenu] ${action}`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState<MenuFormState>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [error, setError] = useState("");

  const loadMenu = useCallback(async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Client Supabase non disponibile.");
      setIsLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("menu_items")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (queryError) {
      logSupabaseError("select menu_items", queryError);
      setError(queryError.message);
    } else {
      setItems(data ?? []);
      setError("");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set([
          ...suggestedCategories,
          ...items.map((item) => item.category).filter(Boolean),
        ]),
      ),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      filterCategory === "all"
        ? items
        : items.filter((item) => item.category === filterCategory),
    [filterCategory, items],
  );

  function updateField<Key extends keyof MenuFormState>(
    key: Key,
    value: MenuFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateName(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug:
        !editingId || current.slug === slugify(current.name)
          ? slugify(value)
          : current.slug,
    }));
  }

  function openCreateForm() {
    setEditingId("");
    setForm(emptyForm);
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(item: MenuItemRow) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      category: item.category,
      description: item.description || "",
      price: item.price?.toString() || "",
      ingredients: item.ingredients || "",
      alcoholLevel: item.alcohol_level || "",
      isFeatured: item.is_featured,
      isAvailable: item.is_available,
      displayOrder: item.display_order.toString(),
    });
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId("");
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const slug = slugify(form.slug || form.name);
    if (!slug) {
      setError("Inserisci un nome o uno slug valido.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      slug,
      category: form.category.trim(),
      description: form.description.trim() || null,
      price: form.price ? Number(form.price) : null,
      ingredients: form.ingredients.trim() || null,
      alcohol_level: form.alcoholLevel.trim() || null,
      is_featured: form.isFeatured,
      is_available: form.isAvailable,
      display_order: Number(form.displayOrder) || 0,
    };

    const result = editingId
      ? await supabase
          .from("menu_items")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("menu_items").insert(payload);

    if (result.error) {
      logSupabaseError(
        editingId ? "update menu_item" : "insert menu_item",
        result.error,
      );
      setError(result.error.message);
      setIsSaving(false);
      return;
    }

    closeForm();
    setIsSaving(false);
    setIsLoading(true);
    await loadMenu();
  }

  async function toggleItem(
    item: MenuItemRow,
    field: "is_available" | "is_featured",
  ) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setActiveId(item.id);
    setError("");
    const nextValue = !item[field];
    const payload =
      field === "is_available"
        ? { is_available: nextValue }
        : { is_featured: nextValue };
    const { error: updateError } = await supabase
      .from("menu_items")
      .update(payload)
      .eq("id", item.id);

    if (updateError) {
      logSupabaseError(`toggle ${field}`, updateError);
      setError(updateError.message);
    } else {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, [field]: nextValue }
            : currentItem,
        ),
      );
    }
    setActiveId("");
  }

  async function deleteItem(id: string) {
    if (!window.confirm("Eliminare definitivamente questo cocktail?")) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setActiveId(id);
    const { error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      logSupabaseError("delete menu_item", deleteError);
      setError(deleteError.message);
    } else {
      setItems((current) => current.filter((item) => item.id !== id));
    }
    setActiveId("");
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
            Nuovo cocktail
          </button>
        }
        description="Crea, pubblica e ordina i cocktail mostrati sul sito Noir."
        eyebrow="Food & beverage"
        title="Menu"
      />

      {error && <AdminError message={error} />}

      {isFormOpen && (
        <section className={cn(panelClass, "p-5 sm:p-7")}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-gold uppercase">
                {editingId ? "Modifica cocktail" : "Nuovo cocktail"}
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
              <span className={labelClass}>Nome *</span>
              <input
                className={inputClass}
                onChange={(event) => updateName(event.target.value)}
                required
                value={form.name}
              />
            </label>

            <label>
              <span className={labelClass}>Slug *</span>
              <input
                className={inputClass}
                onChange={(event) => updateField("slug", event.target.value)}
                required
                value={form.slug}
              />
            </label>

            <label>
              <span className={labelClass}>Categoria *</span>
              <input
                className={inputClass}
                list="menu-categories"
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                required
                value={form.category}
              />
              <datalist id="menu-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>

            <label>
              <span className={labelClass}>Prezzo</span>
              <input
                className={inputClass}
                min="0"
                onChange={(event) => updateField("price", event.target.value)}
                step="0.01"
                type="number"
                value={form.price}
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
              <span className={labelClass}>Gradazione</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("alcoholLevel", event.target.value)
                }
                placeholder="Es. 18% vol. / Analcolico"
                value={form.alcoholLevel}
              />
            </label>

            <label>
              <span className={labelClass}>Ordine</span>
              <input
                className={inputClass}
                min="0"
                onChange={(event) =>
                  updateField("displayOrder", event.target.value)
                }
                type="number"
                value={form.displayOrder}
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
              <input
                checked={form.isAvailable}
                onChange={(event) =>
                  updateField("isAvailable", event.target.checked)
                }
                type="checkbox"
              />
              Disponibile sul sito
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
              <input
                checked={form.isFeatured}
                onChange={(event) =>
                  updateField("isFeatured", event.target.checked)
                }
                type="checkbox"
              />
              In evidenza nella Home
            </label>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                className={primaryButtonClass}
                disabled={isSaving}
                type="submit"
              >
                <Save size={16} />
                {isSaving ? "Salvataggio..." : "Salva cocktail"}
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
            Cocktail pubblicati
          </h2>
          <select
            className={cn(inputClass, "sm:max-w-xs")}
            onChange={(event) => setFilterCategory(event.target.value)}
            value={filterCategory}
          >
            <option value="all">Tutte le categorie</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <AdminLoading label="Caricamento menu..." />
        ) : filteredItems.length === 0 ? (
          <AdminEmpty message="Nessun cocktail presente per questo filtro." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredItems.map((item) => {
              const isBusy = activeId === item.id;

              return (
                <article
                  className={cn(panelClass, "overflow-hidden")}
                  key={item.id}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-gold uppercase">
                          {item.category}
                        </p>
                        <h3 className="mt-2 break-words font-display text-2xl text-gold-light">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs text-noir-gray">
                          /{item.slug}
                        </p>
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
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[0.62rem] uppercase",
                          item.is_available
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                            : "border-white/10 bg-white/[0.04] text-noir-gray",
                        )}
                      >
                        {item.is_available ? "Disponibile" : "Nascosto"}
                      </span>
                      {item.is_featured && (
                        <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[0.62rem] text-gold uppercase">
                          Featured
                        </span>
                      )}
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.62rem] text-noir-gray">
                        Ordine {item.display_order}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                      <button
                        className={secondaryButtonClass}
                        disabled={isBusy}
                        onClick={() => openEditForm(item)}
                        type="button"
                      >
                        <Edit3 size={15} />
                        Modifica
                      </button>
                      <button
                        className={secondaryButtonClass}
                        disabled={isBusy}
                        onClick={() => void toggleItem(item, "is_available")}
                        type="button"
                      >
                        {item.is_available ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                        {item.is_available ? "Nascondi" : "Pubblica"}
                      </button>
                      <button
                        className={secondaryButtonClass}
                        disabled={isBusy}
                        onClick={() => void toggleItem(item, "is_featured")}
                        type="button"
                      >
                        <Star size={15} />
                        {item.is_featured
                          ? "Rimuovi featured"
                          : "Metti in Home"}
                      </button>
                      <button
                        className={dangerButtonClass}
                        disabled={isBusy}
                        onClick={() => void deleteItem(item.id)}
                        type="button"
                      >
                        <Trash2 size={15} />
                        Elimina
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
