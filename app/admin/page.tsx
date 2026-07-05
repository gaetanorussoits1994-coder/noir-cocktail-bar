"use client";

import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ImageIcon,
  Martini,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  panelClass,
} from "@/components/admin/admin-ui";
import { SiteQrCard } from "@/components/admin/site-qr-card";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type DashboardStats = {
  pendingBookings: number;
  confirmedBookings: number;
  activeMenuItems: number;
  activeEvents: number;
};

const initialStats: DashboardStats = {
  pendingBookings: 0,
  confirmedBookings: 0,
  activeMenuItems: 0,
  activeEvents: 0,
};

const quickLinks = [
  {
    href: "/admin/bookings",
    titleKey: "admin.bookings",
    descriptionKey: "admin.bookingsDescription",
    icon: Users,
  },
  {
    href: "/admin/menu",
    titleKey: "admin.menu",
    descriptionKey: "admin.menuDescription",
    icon: Martini,
  },
  {
    href: "/admin/events",
    titleKey: "admin.events",
    descriptionKey: "admin.eventsDescription",
    icon: CalendarDays,
  },
  {
    href: "/admin/gallery",
    titleKey: "admin.gallery",
    descriptionKey: "admin.galleryDescription",
    icon: ImageIcon,
  },
] as const;

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(
        t("admin.configError"),
      );
      setIsLoading(false);
      return;
    }

    const client = supabase;
    let isMounted = true;

    async function loadStats() {
      const results = await Promise.all([
        client
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        client
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed"),
        client
          .from("menu_items")
          .select("id", { count: "exact", head: true })
          .eq("is_available", true),
        client
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
      ]);

      if (!isMounted) return;

      const firstError = results.find((result) => result.error)?.error;
      if (firstError) {
        setError(firstError.message);
        setIsLoading(false);
        return;
      }

      setStats({
        pendingBookings: results[0].count ?? 0,
        confirmedBookings: results[1].count ?? 0,
        activeMenuItems: results[2].count ?? 0,
        activeEvents: results[3].count ?? 0,
      });
      setIsLoading(false);
    }

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const statCards = [
    {
      label: t("admin.pendingBookings"),
      value: stats.pendingBookings,
      icon: CalendarClock,
    },
    {
      label: t("admin.confirmedBookings"),
      value: stats.confirmedBookings,
      icon: CalendarCheck,
    },
    {
      label: t("admin.activeMenuItems"),
      value: stats.activeMenuItems,
      icon: Martini,
    },
    {
      label: t("admin.activeEvents"),
      value: stats.activeEvents,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid gap-9">
      <AdminPageHeader
        description={t("admin.dashboardDescription")}
        eyebrow={t("admin.controlRoom")}
        title={t("admin.dashboard")}
      />

      {error && <AdminError message={error} />}

      {isLoading ? (
        <AdminLoading label={t("admin.loadingStats")} />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => (
            <article className={cn(panelClass, "p-5 sm:p-6")} key={label}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs leading-5 text-noir-gray">{label}</p>
                  <p className="mt-3 font-display text-4xl text-gold-light">
                    {value}
                  </p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                  <Icon size={18} />
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      <section>
        <div className="mb-5">
          <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-gold uppercase">
            {t("admin.management")}
          </p>
          <h2 className="mt-2 font-display text-3xl text-gold-light">
            {t("admin.quickAccess")}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {quickLinks.map(
            ({ href, titleKey, descriptionKey, icon: Icon }) => (
            <Link
              className={cn(
                panelClass,
                "group flex items-center gap-5 p-5 transition hover:-translate-y-0.5 hover:border-gold/30 sm:p-6",
              )}
              href={href}
              key={href}
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-background-primary">
                <Icon size={20} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-2xl text-gold-light">
                  {t(titleKey)}
                </span>
                <span className="mt-1 block text-sm leading-6 text-noir-gray">
                  {t(descriptionKey)}
                </span>
              </span>
            </Link>
            ),
          )}
        </div>
      </section>

      <SiteQrCard />
    </div>
  );
}
