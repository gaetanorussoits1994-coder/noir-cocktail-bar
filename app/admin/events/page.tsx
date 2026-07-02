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
import { getSupabaseClient } from "@/lib/supabase";
import type { EventRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type EventFormState = {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  imageUrl: string;
  isActive: boolean;
};

const emptyForm: EventFormState = {
  title: "",
  description: "",
  eventDate: "",
  eventTime: "",
  imageUrl: "",
  isActive: true,
};

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Client Supabase non disponibile.");
      setIsLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (queryError) setError(queryError.message);
    else {
      setEvents(data ?? []);
      setError("");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  function openCreateForm() {
    setEditingId("");
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditForm(event: EventRow) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      eventDate: event.event_date || "",
      eventTime: event.event_time?.slice(0, 5) || "",
      imageUrl: event.image_url || "",
      isActive: event.is_active,
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

    setIsSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_date: form.eventDate || null,
      event_time: form.eventTime || null,
      image_url: form.imageUrl.trim() || null,
      is_active: form.isActive,
    };

    const result = editingId
      ? await supabase.from("events").update(payload).eq("id", editingId)
      : await supabase.from("events").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    closeForm();
    setIsLoading(true);
    await loadEvents();
  }

  async function deleteEvent(id: string) {
    if (!window.confirm("Eliminare definitivamente questo evento?")) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteError) setError(deleteError.message);
    else setEvents((current) => current.filter((event) => event.id !== id));
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
            Nuovo evento
          </button>
        }
        description="Crea e aggiorna il calendario delle esperienze Noir."
        eyebrow="Noir nights"
        title="Eventi"
      />

      {error && <AdminError message={error} />}

      {isFormOpen && (
        <section className={cn(panelClass, "p-5 sm:p-7")}>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-gold uppercase">
                {editingId ? "Modifica evento" : "Nuovo evento"}
              </p>
              <h2 className="mt-2 font-display text-3xl text-gold-light">
                Dettagli evento
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
            <label className="md:col-span-2">
              <span className={labelClass}>Titolo</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
                value={form.title}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>Descrizione</span>
              <textarea
                className={cn(inputClass, "min-h-28 resize-y")}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                value={form.description}
              />
            </label>

            <label>
              <span className={labelClass}>Data</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    eventDate: event.target.value,
                  }))
                }
                type="date"
                value={form.eventDate}
              />
            </label>

            <label>
              <span className={labelClass}>Ora</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    eventTime: event.target.value,
                  }))
                }
                type="time"
                value={form.eventTime}
              />
            </label>

            <label className="md:col-span-2">
              <span className={labelClass}>Immagine URL</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imageUrl: event.target.value,
                  }))
                }
                value={form.imageUrl}
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
              Evento attivo
            </label>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                className={primaryButtonClass}
                disabled={isSaving}
                type="submit"
              >
                <Save size={16} />
                {isSaving ? "Salvataggio..." : "Salva evento"}
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

      {isLoading ? (
        <AdminLoading label="Caricamento eventi..." />
      ) : events.length === 0 ? (
        <AdminEmpty message="Nessun evento presente." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article
              className={cn(panelClass, "overflow-hidden")}
              key={event.id}
            >
              {event.image_url && (
                <div
                  aria-label={`Immagine ${event.title}`}
                  className="h-44 bg-cover bg-center"
                  role="img"
                  style={{ backgroundImage: `url("${event.image_url}")` }}
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-gold uppercase">
                      {event.event_date
                        ? dateFormatter.format(
                            new Date(`${event.event_date}T00:00:00`),
                          )
                        : "Data da definire"}
                      {event.event_time &&
                        ` · ${event.event_time.slice(0, 5)}`}
                    </p>
                    <h2 className="mt-2 break-words font-display text-2xl text-gold-light">
                      {event.title}
                    </h2>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[0.62rem] uppercase",
                      event.is_active
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                        : "border-white/10 text-noir-gray",
                    )}
                  >
                    {event.is_active ? "Attivo" : "Nascosto"}
                  </span>
                </div>

                {event.description && (
                  <p className="mt-3 text-sm leading-6 text-noir-gray">
                    {event.description}
                  </p>
                )}

                <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                  <button
                    className={secondaryButtonClass}
                    onClick={() => openEditForm(event)}
                    type="button"
                  >
                    <Edit3 size={15} />
                    Modifica
                  </button>
                  <button
                    className={dangerButtonClass}
                    onClick={() => deleteEvent(event.id)}
                    type="button"
                  >
                    <Trash2 size={15} />
                    Elimina
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
