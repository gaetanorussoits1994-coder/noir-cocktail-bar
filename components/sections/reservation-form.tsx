"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type ReservationFormState = {
  customerName: string;
  phone: string;
  email: string;
  reservationDate: string;
  reservationTime: string;
  guests: string;
  notes: string;
};

const initialForm: ReservationFormState = {
  customerName: "",
  phone: "",
  email: "",
  reservationDate: "",
  reservationTime: "",
  guests: "2",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-noir-white outline-none transition placeholder:text-noir-gray/55 focus:border-gold/60 focus:ring-2 focus:ring-gold/10 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass =
  "mb-2 block text-[0.65rem] font-semibold tracking-[0.15em] text-gold uppercase";

function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function ReservationForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const minimumDate = useMemo(getLocalDate, []);

  function updateField<Key extends keyof ReservationFormState>(
    key: Key,
    value: ReservationFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function validateForm() {
    const phoneDigits = form.phone.replace(/\D/g, "");
    const guests = Number(form.guests);

    if (form.customerName.trim().length < 2) {
      return "Inserisci un nome valido.";
    }
    if (phoneDigits.length < 7) {
      return "Inserisci un numero di telefono valido.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Inserisci un indirizzo email valido.";
    }
    if (!form.reservationDate || form.reservationDate < minimumDate) {
      return "Seleziona una data valida, da oggi in avanti.";
    }
    if (!form.reservationTime) {
      return "Seleziona un orario.";
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 30) {
      return "Il numero di persone deve essere compreso tra 1 e 30.";
    }
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError(
        "Il servizio prenotazioni non è disponibile. Riprova tra poco o contattaci telefonicamente.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    const { error: insertError } = await supabase.from("reservations").insert({
      customer_name: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      reservation_date: form.reservationDate,
      reservation_time: form.reservationTime,
      guests: Number(form.guests),
      notes: form.notes.trim() || null,
      status: "pending",
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(
        "Non è stato possibile inviare la richiesta. Riprova tra poco o contattaci telefonicamente.",
      );
      return;
    }

    setForm(initialForm);
    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <div
        className="flex min-h-[32rem] flex-col items-center justify-center rounded-card border border-gold/20 bg-background-secondary p-8 text-center shadow-gold"
        id="reservation-form"
        role="status"
      >
        <span className="flex size-16 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-200">
          <CheckCircle2 aria-hidden="true" size={28} strokeWidth={1.5} />
        </span>
        <h3 className="mt-6 font-display text-3xl text-gold-light">
          Richiesta ricevuta
        </h3>
        <p className="mt-4 max-w-md text-sm leading-7 text-noir-gray">
          Grazie, la tua richiesta di prenotazione è stata inviata. Ti
          confermeremo la disponibilità il prima possibile.
        </p>
        <button
          className="mt-7 text-xs font-semibold tracking-[0.12em] text-gold uppercase transition hover:text-gold-light"
          onClick={() => setIsSuccess(false)}
          type="button"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    );
  }

  return (
    <form
      className="rounded-card border border-gold/20 bg-background-secondary p-5 shadow-gold sm:p-7"
      id="reservation-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="border-b border-border pb-5">
        <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
          Richiesta tavolo
        </p>
        <h3 className="mt-2 font-display text-3xl text-gold-light">
          Prenota la tua serata
        </h3>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className={labelClass}>Nome *</span>
          <input
            autoComplete="name"
            className={inputClass}
            disabled={isSubmitting}
            maxLength={100}
            onChange={(event) => updateField("customerName", event.target.value)}
            placeholder="Nome e cognome"
            required
            type="text"
            value={form.customerName}
          />
        </label>

        <label>
          <span className={labelClass}>Telefono *</span>
          <input
            autoComplete="tel"
            className={inputClass}
            disabled={isSubmitting}
            maxLength={30}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+39 333 123 4567"
            required
            type="tel"
            value={form.phone}
          />
        </label>

        <label>
          <span className={labelClass}>Email</span>
          <input
            autoComplete="email"
            className={inputClass}
            disabled={isSubmitting}
            maxLength={320}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="nome@email.it"
            type="email"
            value={form.email}
          />
        </label>

        <label>
          <span className={labelClass}>Data *</span>
          <input
            className={cn(inputClass, "[color-scheme:dark]")}
            disabled={isSubmitting}
            min={minimumDate}
            onChange={(event) =>
              updateField("reservationDate", event.target.value)
            }
            required
            type="date"
            value={form.reservationDate}
          />
        </label>

        <label>
          <span className={labelClass}>Ora *</span>
          <input
            className={cn(inputClass, "[color-scheme:dark]")}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("reservationTime", event.target.value)
            }
            required
            type="time"
            value={form.reservationTime}
          />
        </label>

        <label>
          <span className={labelClass}>Numero persone *</span>
          <input
            className={inputClass}
            disabled={isSubmitting}
            max={30}
            min={1}
            onChange={(event) => updateField("guests", event.target.value)}
            required
            type="number"
            value={form.guests}
          />
        </label>

        <label className="sm:col-span-2">
          <span className={labelClass}>Note</span>
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            disabled={isSubmitting}
            maxLength={1000}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Allergie, richieste speciali o altre informazioni"
            value={form.notes}
          />
        </label>
      </div>

      {error && (
        <p
          className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold bg-gold px-5 py-3.5 text-sm font-semibold text-background-primary shadow-gold transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting && (
          <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />
        )}
        {isSubmitting ? "Invio in corso..." : "Invia richiesta"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-noir-gray">
        La prenotazione sarà valida dopo la conferma dello staff.
      </p>
    </form>
  );
}
