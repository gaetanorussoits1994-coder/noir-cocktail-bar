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
import { useTranslation } from "@/lib/i18n/use-translation";
import {
  getMenuItemIdentity,
  slugifyMenuValue,
} from "@/lib/menu-items";
import { getSupabaseClient } from "@/lib/supabase";
import type { MenuItemRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const menuCopy = {
  it: {
    new: "Nuovo cocktail", edit: "Modifica cocktail", description: "Crea, pubblica e ordina i prodotti mostrati sul sito Noir.",
    details: "Dettagli menu", close: "Chiudi form", name: "Nome", category: "Categoria", price: "Prezzo",
    productDescription: "Descrizione", story: "Storia / origine", ingredients: "Ingredienti",
    tags: "Tag e allergeni", tagsHelp: "Separa i valori con una virgola. Gli allergeni riconosciuti vengono mostrati automaticamente nelle card.",
    alcohol: "Gradazione", style: "Stile prodotto", glass: "Bicchiere consigliato", technique: "Tecnica di preparazione",
    format: "Formato di servizio", temperature: "Temperatura di servizio", recommendation: "Consiglio dello staff / chef",
    pairing: "Abbinamento consigliato", order: "Ordine", availableSite: "Disponibile sul sito",
    featuredHome: "In evidenza nella Home", saving: "Salvataggio...", save: "Salva prodotto", cancel: "Annulla",
    published: "Prodotti pubblicati", allCategories: "Tutte le categorie", loading: "Caricamento menu...",
    empty: "Nessun prodotto presente per questo filtro.", available: "Disponibile", hidden: "Nascosto",
    editAction: "Modifica", hide: "Nascondi", publish: "Pubblica", removeFeatured: "Rimuovi featured",
    putHome: "Metti in Home", delete: "Elimina",
  },
  en: {
    new: "New product", edit: "Edit product", description: "Create, publish and arrange the products displayed on the Noir website.",
    details: "Menu details", close: "Close form", name: "Name", category: "Category", price: "Price",
    productDescription: "Description", story: "Story / origin", ingredients: "Ingredients",
    tags: "Tags and allergens", tagsHelp: "Separate values with commas. Recognised allergens are automatically shown on cards.",
    alcohol: "Alcohol level", style: "Product style", glass: "Recommended glassware", technique: "Preparation technique",
    format: "Serving format", temperature: "Serving temperature", recommendation: "Staff / chef recommendation",
    pairing: "Recommended pairing", order: "Display order", availableSite: "Available on website",
    featuredHome: "Featured on homepage", saving: "Saving...", save: "Save product", cancel: "Cancel",
    published: "Published products", allCategories: "All categories", loading: "Loading menu...",
    empty: "No products found for this filter.", available: "Available", hidden: "Hidden",
    editAction: "Edit", hide: "Hide", publish: "Publish", removeFeatured: "Remove featured",
    putHome: "Feature on homepage", delete: "Delete",
  },
} as const;

type MenuFormState = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  ingredients: string;
  tags: string;
  alcoholLevel: string;
  story: string;
  glassware: string;
  garnish: string;
  preparationTechnique: string;
  staffRecommendation: string;
  pairing: string;
  productStyle: string;
  servingFormat: string;
  servingTemperature: string;
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
  tags: "",
  alcoholLevel: "",
  story: "",
  glassware: "",
  garnish: "",
  preparationTechnique: "",
  staffRecommendation: "",
  pairing: "",
  productStyle: "",
  servingFormat: "",
  servingTemperature: "",
  isFeatured: false,
  isAvailable: true,
  displayOrder: "0",
};

const suggestedCategories = [
  "Cocktail Signature",
  "Cocktail Classici",
  "Negroni Collection",
  "Champagne",
  "Prosecco",
  "Vini Bianchi",
  "Vini Rossi",
  "Birre",
  "Cocktail Analcolici",
  "Soft Drinks",
  "Acque",
  "Caffetteria",
  "Food & Cicchetti",
  "Dolci",
];

const priceFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

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
  const { locale } = useTranslation();
  const labels = menuCopy[locale];
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
        !editingId || current.slug === slugifyMenuValue(current.name)
          ? slugifyMenuValue(value)
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
      tags: item.tags.join(", "),
      alcoholLevel: item.alcohol_level || "",
      story: item.story || "",
      glassware: item.glassware || "",
      garnish: item.garnish || "",
      preparationTechnique: item.preparation_technique || "",
      staffRecommendation: item.staff_recommendation || "",
      pairing: item.pairing || "",
      productStyle: item.product_style || "",
      servingFormat: item.serving_format || "",
      servingTemperature: item.serving_temperature || "",
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

    const name = form.name.trim();
    const category = form.category.trim();
    const slug = slugifyMenuValue(form.slug || name);
    if (!name || !category || !slug) {
      setError("Inserisci un nome o uno slug valido.");
      return;
    }

    setIsSaving(true);
    setError("");

    const { data: existingItems, error: duplicateCheckError } =
      await supabase
        .from("menu_items")
        .select("id, name, category");

    if (duplicateCheckError) {
      logSupabaseError(
        "verifica duplicati menu_items",
        duplicateCheckError,
      );
      setError(
        "Non è stato possibile verificare eventuali duplicati. Riprova.",
      );
      setIsSaving(false);
      return;
    }

    const productIdentity = getMenuItemIdentity({ name, category });
    const duplicateItem = (existingItems ?? []).find(
      (item) =>
        item.id !== editingId &&
        getMenuItemIdentity(item) === productIdentity,
    );

    if (duplicateItem) {
      setError(
        `Esiste già una voce “${name}” nella categoria “${category}”.`,
      );
      setIsSaving(false);
      return;
    }

    const payload = {
      name,
      slug,
      category,
      description: form.description.trim() || null,
      price: form.price ? Number(form.price) : null,
      ingredients: form.ingredients.trim() || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      alcohol_level: form.alcoholLevel.trim() || null,
      story: form.story.trim() || null,
      glassware: form.glassware.trim() || null,
      garnish: form.garnish.trim() || null,
      preparation_technique:
        form.preparationTechnique.trim() || null,
      staff_recommendation:
        form.staffRecommendation.trim() || null,
      pairing: form.pairing.trim() || null,
      product_style: form.productStyle.trim() || null,
      serving_format: form.servingFormat.trim() || null,
      serving_temperature:
        form.servingTemperature.trim() || null,
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
            {labels.new}
          </button>
        }
        description={labels.description}
        eyebrow="Food & beverage"
        title="Menu"
      />

      {error && <AdminError message={error} />}

      {isFormOpen && (
        <section className={cn(panelClass, "p-5 sm:p-7")}>
          <div className="mb-6 flex items-start justify-between gap-4">
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
              <span className={labelClass}>{labels.name} *</span>
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
              <span className={labelClass}>{labels.category} *</span>
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
              <span className={labelClass}>{labels.price}</span>
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
              <span className={labelClass}>{labels.productDescription}</span>
              <textarea
                className={cn(inputClass, "min-h-24 resize-y")}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                value={form.description}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>{labels.story}</span>
              <textarea
                className={cn(inputClass, "min-h-20 resize-y")}
                onChange={(event) =>
                  updateField("story", event.target.value)
                }
                value={form.story}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>{labels.ingredients}</span>
              <textarea
                className={cn(inputClass, "min-h-20 resize-y")}
                onChange={(event) =>
                  updateField("ingredients", event.target.value)
                }
                value={form.ingredients}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>{labels.tags}</span>
              <input
                className={inputClass}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="Signature, Solfiti, Latte, Mandorla"
                value={form.tags}
              />
              <span className="mt-2 block text-xs leading-5 text-noir-gray">
                {labels.tagsHelp}
              </span>
            </label>

            <label>
              <span className={labelClass}>{labels.alcohol}</span>
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
              <span className={labelClass}>{labels.style}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("productStyle", event.target.value)
                }
                placeholder="Es. Lager, Sour, Champagne Brut"
                value={form.productStyle}
              />
            </label>

            <label>
              <span className={labelClass}>{labels.glass}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("glassware", event.target.value)
                }
                value={form.glassware}
              />
            </label>

            <label>
              <span className={labelClass}>Garnish</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("garnish", event.target.value)
                }
                value={form.garnish}
              />
            </label>

            <label>
              <span className={labelClass}>{labels.technique}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("preparationTechnique", event.target.value)
                }
                value={form.preparationTechnique}
              />
            </label>

            <label>
              <span className={labelClass}>{labels.format}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("servingFormat", event.target.value)
                }
                placeholder="Es. 33 cl, calice 125 ml"
                value={form.servingFormat}
              />
            </label>

            <label>
              <span className={labelClass}>{labels.temperature}</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateField("servingTemperature", event.target.value)
                }
                placeholder="Es. 4–6 °C"
                value={form.servingTemperature}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>{labels.recommendation}</span>
              <textarea
                className={cn(inputClass, "min-h-20 resize-y")}
                onChange={(event) =>
                  updateField("staffRecommendation", event.target.value)
                }
                value={form.staffRecommendation}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>{labels.pairing}</span>
              <textarea
                className={cn(inputClass, "min-h-20 resize-y")}
                onChange={(event) =>
                  updateField("pairing", event.target.value)
                }
                value={form.pairing}
              />
            </label>

            <label>
              <span className={labelClass}>{labels.order}</span>
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
              {labels.availableSite}
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
              <input
                checked={form.isFeatured}
                onChange={(event) =>
                  updateField("isFeatured", event.target.checked)
                }
                type="checkbox"
              />
              {labels.featuredHome}
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

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl text-gold-light">
            {labels.published}
          </h2>
          <select
            className={cn(inputClass, "sm:max-w-xs")}
            onChange={(event) => setFilterCategory(event.target.value)}
            value={filterCategory}
          >
            <option value="all">{labels.allCategories}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <AdminLoading label={labels.loading} />
        ) : filteredItems.length === 0 ? (
          <AdminEmpty message={labels.empty} />
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
                        {item.is_available ? labels.available : labels.hidden}
                      </span>
                      {item.is_featured && (
                        <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[0.62rem] text-gold uppercase">
                          Featured
                        </span>
                      )}
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.62rem] text-noir-gray">
                        {labels.order} {item.display_order}
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
                        {labels.editAction}
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
                        {item.is_available ? labels.hide : labels.publish}
                      </button>
                      <button
                        className={secondaryButtonClass}
                        disabled={isBusy}
                        onClick={() => void toggleItem(item, "is_featured")}
                        type="button"
                      >
                        <Star size={15} />
                        {item.is_featured
                          ? labels.removeFeatured
                          : labels.putHome}
                      </button>
                      <button
                        className={dangerButtonClass}
                        disabled={isBusy}
                        onClick={() => void deleteItem(item.id)}
                        type="button"
                      >
                        <Trash2 size={15} />
                        {labels.delete}
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
