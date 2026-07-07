"use client";

import { Check, MessageCircle, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  dangerButtonClass,
  panelClass,
  secondaryButtonClass,
} from "@/components/admin/admin-ui";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type AdminReservationRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  notes: string | null;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  created_at: string;
};

const bookingCopy = {
  it: {
    confirm: "Conferma", reject: "Rifiuta", delete: "Elimina prenotazione",
    deleteConfirm: "Eliminare definitivamente questa prenotazione?",
    description: "Gestisci richieste, stati e dettagli delle prenotazioni tavoli.",
    title: "Prenotazioni", auto: "Aggiornamento automatico attivo",
    last: "Ultimo aggiornamento", loading: "Caricamento prenotazioni...",
    empty: "Nessuna prenotazione presente.", date: "Data", time: "Ora",
    guests: "Ospiti", created: "Creata", customer: "Cliente",
    contacts: "Contatti", dateTime: "Data / Ora", status: "Stato",
    notes: "Note", createdAt: "Creata il", actions: "Azioni",
    supabaseUnavailable: "Client Supabase non disponibile.",
    whatsappConfirmed: "Ciao {name}, la tua prenotazione da Noir Cocktail Bar per il giorno {date} alle {time} per {guests} persone e confermata. Ti aspettiamo.",
    whatsappRejected: "Ciao {name}, ci dispiace ma nella fascia oraria scelta non abbiamo disponibilita. Ti invitiamo a scegliere un altro orario o a contattarci per maggiori informazioni.",
    statuses: { pending: "In attesa", confirmed: "Confermata", rejected: "Rifiutata", cancelled: "Annullata" },
  },
  en: {
    confirm: "Confirm", reject: "Reject", delete: "Delete booking",
    deleteConfirm: "Permanently delete this booking?",
    description: "Manage table requests, statuses and booking details.",
    title: "Bookings", auto: "Automatic updates active",
    last: "Last updated", loading: "Loading bookings...",
    empty: "No bookings found.", date: "Date", time: "Time",
    guests: "Guests", created: "Created", customer: "Guest",
    contacts: "Contact details", dateTime: "Date / Time", status: "Status",
    notes: "Notes", createdAt: "Submitted at", actions: "Actions",
    supabaseUnavailable: "Supabase client is unavailable.",
    whatsappConfirmed: "Hi {name}, your booking at Noir Cocktail Bar for {date} at {time} for {guests} guests is confirmed. We look forward to welcoming you.",
    whatsappRejected: "Hi {name}, unfortunately we do not have availability for the selected time slot. Please choose another time or contact us for more information.",
    statuses: { pending: "Pending", confirmed: "Confirmed", rejected: "Rejected", cancelled: "Cancelled" },
  },
} as const;

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const statusStyles: Record<AdminReservationRow["status"], string> = {
  pending: "border-amber-300/25 bg-amber-400/10 text-amber-200",
  confirmed: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
  rejected: "border-red-300/25 bg-red-400/10 text-red-200",
  cancelled: "border-white/15 bg-white/[0.05] text-noir-gray",
};

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function getWhatsAppHref(
  booking: AdminReservationRow,
  labels: typeof bookingCopy.it | typeof bookingCopy.en,
) {
  let phone = booking.customer_phone.replace(/\D/g, "");
  if (phone.startsWith("00")) phone = phone.slice(2);
  if (phone.length === 10 && phone.startsWith("3")) phone = `39${phone}`;

  const message =
    booking.status === "confirmed"
      ? labels.whatsappConfirmed
          .replace("{name}", booking.customer_name)
          .replace("{date}", formatDate(booking.reservation_date))
          .replace("{time}", booking.reservation_time.slice(0, 5))
          .replace("{guests}", String(booking.guests))
      : labels.whatsappRejected.replace("{name}", booking.customer_name);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function AdminBookingsPage() {
  const { locale } = useTranslation();
  const labels = bookingCopy[locale];
  const [bookings, setBookings] = useState<AdminReservationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const activeIdRef = useRef("");
  const isFetchingRef = useRef(false);

  const loadBookings = useCallback(async () => {
    if (isFetchingRef.current) return;

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(labels.supabaseUnavailable);
      setIsLoading(false);
      return;
    }

    isFetchingRef.current = true;

    const { data, error: queryError } = await supabase
      .from("reservations")
      .select(
        "id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, guests, notes, status, created_at",
      )
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("SUPABASE_RESERVATIONS_SELECT_ERROR", {
        message: queryError.message,
        details: queryError.details,
        hint: queryError.hint,
        code: queryError.code,
      });
      setError(queryError.message);
    } else {
      if (!data?.length) {
        console.log("SUPABASE_RESERVATIONS_SELECT_EMPTY", data);
      }
      setBookings((data ?? []) as AdminReservationRow[]);
      setError("");
      setLastUpdatedAt(new Date());
    }

    setIsLoading(false);
    isFetchingRef.current = false;
  }, [labels.supabaseUnavailable]);

  useEffect(() => {
    void loadBookings();

    const supabase = getSupabaseClient();
    const refreshIfIdle = () => {
      if (!activeIdRef.current && !isFetchingRef.current) {
        void loadBookings();
      }
    };
    const pollingInterval = window.setInterval(refreshIfIdle, 10_000);
    const channel = supabase
      ?.channel("admin-reservations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        refreshIfIdle,
      )
      .subscribe();

    return () => {
      window.clearInterval(pollingInterval);
      if (supabase && channel) void supabase.removeChannel(channel);
    };
  }, [loadBookings]);

  async function updateStatus(
    id: string,
    status: "confirmed" | "rejected",
  ) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    activeIdRef.current = id;
    setActiveId(id);
    setError("");

    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, status } : booking,
        ),
      );
      await loadBookings();
    }

    activeIdRef.current = "";
    setActiveId("");
  }

  async function deleteBooking(id: string) {
    if (!window.confirm(labels.deleteConfirm)) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    activeIdRef.current = id;
    setActiveId(id);
    const { error: deleteError } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setBookings((current) =>
        current.filter((booking) => booking.id !== id),
      );
      await loadBookings();
    }

    activeIdRef.current = "";
    setActiveId("");
  }

  function renderActions(booking: AdminReservationRow) {
    const isBusy = activeId === booking.id;

    return (
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(secondaryButtonClass, "px-3 py-2 text-xs")}
          disabled={isBusy || booking.status === "confirmed"}
          onClick={() => updateStatus(booking.id, "confirmed")}
          type="button"
        >
          <Check size={14} />
          {labels.confirm}
        </button>
        <button
          className={cn(dangerButtonClass, "text-amber-100")}
          disabled={isBusy || booking.status === "rejected"}
          onClick={() => updateStatus(booking.id, "rejected")}
          type="button"
        >
          <X size={14} />
          {labels.reject}
        </button>
        {(booking.status === "confirmed" ||
          booking.status === "rejected") && (
          <a
            className={cn(
              secondaryButtonClass,
              "border-emerald-300/20 text-emerald-100",
            )}
            href={getWhatsAppHref(booking, labels)}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        )}
        <button
          aria-label={labels.delete}
          className={dangerButtonClass}
          disabled={isBusy}
          onClick={() => deleteBooking(booking.id)}
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        description={labels.description}
        eyebrow="Guest management"
        title={labels.title}
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-noir-gray">
        <span className="inline-flex items-center gap-2 text-emerald-200">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.75)]"
          />
          {labels.auto}
        </span>
        {lastUpdatedAt && (
          <span>
            {labels.last}: {timeFormatter.format(lastUpdatedAt)}
          </span>
        )}
      </div>

      {error && <AdminError message={error} />}

      {isLoading ? (
        <AdminLoading label={labels.loading} />
      ) : bookings.length === 0 ? (
        <AdminEmpty message={labels.empty} />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {bookings.map((booking) => (
              <article className={cn(panelClass, "p-5")} key={booking.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="break-words font-display text-2xl text-gold-light">
                      {booking.customer_name}
                    </h2>
                    <p className="mt-1 text-sm text-noir-gray">
                      {booking.customer_phone}
                    </p>
                    {booking.customer_email && (
                      <p className="mt-1 break-all text-xs text-noir-gray">
                        {booking.customer_email}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase",
                      statusStyles[booking.status],
                    )}
                  >
                    {labels.statuses[booking.status]}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-4 text-sm">
                  <div>
                    <dt className="text-xs text-noir-gray">{labels.date}</dt>
                    <dd className="mt-1">
                      {formatDate(booking.reservation_date)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-noir-gray">{labels.time}</dt>
                    <dd className="mt-1">
                      {booking.reservation_time.slice(0, 5)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-noir-gray">{labels.guests}</dt>
                    <dd className="mt-1">{booking.guests}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-noir-gray">{labels.created}</dt>
                    <dd className="mt-1">
                      {dateTimeFormatter.format(new Date(booking.created_at))}
                    </dd>
                  </div>
                </dl>

                {booking.notes && (
                  <p className="mt-4 text-sm leading-6 text-noir-gray">
                    {booking.notes}
                  </p>
                )}
                <div className="mt-5">{renderActions(booking)}</div>
              </article>
            ))}
          </div>

          <div
            className={cn(
              panelClass,
              "hidden overflow-hidden md:block",
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[75rem] text-left text-sm">
                <thead className="border-b border-white/10 bg-black/20 text-[0.65rem] tracking-[0.12em] text-gold uppercase">
                  <tr>
                    <th className="px-5 py-4">{labels.customer}</th>
                    <th className="px-5 py-4">{labels.contacts}</th>
                    <th className="px-5 py-4">{labels.guests}</th>
                    <th className="px-5 py-4">{labels.dateTime}</th>
                    <th className="px-5 py-4">{labels.status}</th>
                    <th className="px-5 py-4">{labels.notes}</th>
                    <th className="px-5 py-4">{labels.createdAt}</th>
                    <th className="px-5 py-4">{labels.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      className="border-b border-white/[0.06] align-top last:border-0"
                      key={booking.id}
                    >
                      <td className="px-5 py-4 font-medium text-noir-white">
                        {booking.customer_name}
                      </td>
                      <td className="px-5 py-4 text-noir-gray">
                        <span className="block">
                          {booking.customer_phone}
                        </span>
                        <span className="mt-1 block">
                          {booking.customer_email || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">{booking.guests}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(booking.reservation_date)}
                        <span className="ml-2 text-noir-gray">
                          {booking.reservation_time.slice(0, 5)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase",
                            statusStyles[booking.status],
                          )}
                        >
                          {labels.statuses[booking.status]}
                        </span>
                      </td>
                      <td className="max-w-56 px-5 py-4 text-noir-gray">
                        {booking.notes || "—"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-noir-gray">
                        {dateTimeFormatter.format(
                          new Date(booking.created_at),
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {renderActions(booking)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
