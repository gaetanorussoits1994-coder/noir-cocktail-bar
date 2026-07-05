"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  EventCard,
  type EventCardProps,
} from "@/components/cards/event-card";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/lib/i18n/use-translation";
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
  const { locale, t } = useTranslation();
  const [events, setEvents] = useState<EventItem[]>([]);
  const translatedFallbackEvents: EventItem[] = [
    {
      id: "fallback-jazz",
      title: "Jazz Night",
      schedule: t("events.jazz.schedule"),
      description: t("events.jazz.description"),
      number: "01",
    },
    {
      id: "fallback-guest",
      title: "Guest Bartender",
      schedule: t("events.guest.schedule"),
      description: t("events.guest.description"),
      number: "02",
    },
    {
      id: "fallback-private",
      title: "Private Lounge",
      schedule: t("events.private.schedule"),
      description: t("events.private.description"),
      number: "03",
    },
  ];
  const displayedEvents =
    locale === "en" || events.length === 0
      ? translatedFallbackEvents
      : events;

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
      className="w-full max-w-full overflow-hidden bg-background-primary px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      id="events"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          description={t("events.description")}
          label={t("events.label")}
          title={t("events.title")}
        />

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {displayedEvents.map((event, index) => (
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
