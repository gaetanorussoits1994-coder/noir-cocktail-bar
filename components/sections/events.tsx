"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  EventCard,
  type EventCardProps,
} from "@/components/cards/event-card";
import { SectionTitle } from "@/components/ui/section-title";
import { getSupabaseClient } from "@/lib/supabase";

type EventRow = {
  id: string;
  title: string;
  frequency: string | null;
  description: string | null;
  event_date: string | null;
};

type EventItem = EventCardProps & {
  id: string;
};

function formatEventDate(eventDate: string | null) {
  if (!eventDate) {
    return "";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${eventDate}T00:00:00Z`));
}

export function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    async function loadEvents(client: SupabaseClient) {
      try {
        const { data, error } = await client
          .from("events")
          .select(
            "id, title, frequency, description, event_date, sort_order",
          )
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (error || !data || !isMounted) {
          return;
        }

        const eventItems = (data as EventRow[]).map(
          (event, index) => ({
            id: event.id,
            title: event.title,
            schedule:
              event.frequency?.trim() ||
              formatEventDate(event.event_date),
            description: event.description?.trim() || "",
            number: String(index + 1).padStart(2, "0"),
          }),
        );

        setEvents(eventItems);
      } catch {
        // La sezione resta vuota se Supabase non è disponibile.
      }
    }

    void loadEvents(supabase);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="bg-background-primary px-6 py-24 sm:py-32 lg:px-8"
      id="eventi"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          description="Appuntamenti esclusivi, ospiti speciali e atmosfere pensate per rendere ogni serata memorabile."
          label="Noir Nights"
          title="Eventi"
        />

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {events.map((event, index) => (
            <EventCard
              description={event.description}
              delay={index * 0.12}
              key={event.id}
              number={event.number}
              schedule={event.schedule}
              title={event.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
