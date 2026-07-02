"use client";

import { Check, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  dangerButtonClass,
  panelClass,
  secondaryButtonClass,
} from "@/components/admin/admin-ui";
import { getSupabaseClient } from "@/lib/supabase";
import type { BookingRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

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

const statusStyles: Record<BookingRow["status"], string> = {
  pending: "border-amber-300/25 bg-amber-400/10 text-amber-200",
  confirmed: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
  rejected: "border-red-300/25 bg-red-400/10 text-red-200",
  cancelled: "border-white/15 bg-white/[0.05] text-noir-gray",
};

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Client Supabase non disponibile.");
      setIsLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    if (queryError) {
      setError(queryError.message);
    } else {
      setBookings(data ?? []);
      setError("");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  async function updateStatus(
    id: string,
    status: BookingRow["status"],
  ) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setActiveId(id);
    setError("");

    const { error: updateError } = await supabase
      .from("bookings")
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
    }

    setActiveId("");
  }

  async function deleteBooking(id: string) {
    if (!window.confirm("Eliminare definitivamente questa prenotazione?")) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setActiveId(id);
    const { error: deleteError } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setBookings((current) =>
        current.filter((booking) => booking.id !== id),
      );
    }

    setActiveId("");
  }

  function renderActions(booking: BookingRow) {
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
          Conferma
        </button>
        <button
          className={cn(dangerButtonClass, "text-amber-100")}
          disabled={isBusy || booking.status === "rejected"}
          onClick={() => updateStatus(booking.id, "rejected")}
          type="button"
        >
          <X size={14} />
          Rifiuta
        </button>
        <button
          className={secondaryButtonClass}
          disabled={isBusy || booking.status === "cancelled"}
          onClick={() => updateStatus(booking.id, "cancelled")}
          type="button"
        >
          Cancella
        </button>
        <button
          aria-label="Elimina prenotazione"
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
        description="Gestisci richieste, stati e dettagli delle prenotazioni tavoli."
        eyebrow="Guest management"
        title="Prenotazioni"
      />

      {error && <AdminError message={error} />}

      {isLoading ? (
        <AdminLoading label="Caricamento prenotazioni..." />
      ) : bookings.length === 0 ? (
        <AdminEmpty message="Nessuna prenotazione presente." />
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
                      {booking.phone}
                    </p>
                    {booking.email && (
                      <p className="mt-1 break-all text-xs text-noir-gray">
                        {booking.email}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase",
                      statusStyles[booking.status],
                    )}
                  >
                    {booking.status}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-4 text-sm">
                  <div>
                    <dt className="text-xs text-noir-gray">Data</dt>
                    <dd className="mt-1">{formatDate(booking.booking_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-noir-gray">Ora</dt>
                    <dd className="mt-1">{booking.booking_time.slice(0, 5)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-noir-gray">Ospiti</dt>
                    <dd className="mt-1">{booking.guests}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-noir-gray">Creata</dt>
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
                    <th className="px-5 py-4">Cliente</th>
                    <th className="px-5 py-4">Contatti</th>
                    <th className="px-5 py-4">Ospiti</th>
                    <th className="px-5 py-4">Data / Ora</th>
                    <th className="px-5 py-4">Stato</th>
                    <th className="px-5 py-4">Note</th>
                    <th className="px-5 py-4">Creata il</th>
                    <th className="px-5 py-4">Azioni</th>
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
                        <span className="block">{booking.phone}</span>
                        <span className="mt-1 block">{booking.email || "—"}</span>
                      </td>
                      <td className="px-5 py-4">{booking.guests}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(booking.booking_date)}
                        <span className="ml-2 text-noir-gray">
                          {booking.booking_time.slice(0, 5)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase",
                            statusStyles[booking.status],
                          )}
                        >
                          {booking.status}
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
