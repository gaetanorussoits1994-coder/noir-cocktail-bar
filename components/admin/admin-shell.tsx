"use client";

import {
  CalendarDays,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Martini,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", labelKey: "admin.bookings", icon: Users },
  { href: "/admin/menu", labelKey: "admin.menu", icon: Martini },
  { href: "/admin/events", labelKey: "admin.events", icon: CalendarDays },
  { href: "/admin/gallery", labelKey: "admin.gallery", icon: ImageIcon },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const isBookingsPage =
    pathname === "/admin/bookings" ||
    pathname === "/admin/reservations" ||
    pathname === "/admin/prenotazioni";
  const [isLoading, setIsLoading] = useState(!isLoginPage);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [configurationError, setConfigurationError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  const loadPendingBookingsCount = useCallback(async () => {
    if (isLoginPage || !isAuthenticated) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { count, error } = await supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    if (!error) setPendingBookingsCount(count ?? 0);
  }, [isAuthenticated, isLoginPage]);

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    setConfigurationError("");

    const supabase = getSupabaseClient();

    if (!supabase) {
      setConfigurationError(
        t("admin.configError"),
      );
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const redirectExpiredSession = () => {
      if (!isMounted) return;

      setIsAuthenticated(false);
      setIsLoading(false);
      router.replace("/admin/login?reason=session_expired");
    };

    const validateSession = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error || !data.user) {
          redirectExpiredSession();
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch {
        redirectExpiredSession();
      }
    };

    void validateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_OUT") {
        redirectExpiredSession();
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    });

    const handleWindowFocus = () => {
      void validateSession();
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleWindowFocus);
      subscription.unsubscribe();
    };
  }, [isLoginPage, router, t]);

  useEffect(() => {
    if (isLoginPage || !isAuthenticated) return;

    void loadPendingBookingsCount();
    const intervalId = window.setInterval(loadPendingBookingsCount, 10_000);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticated, isLoginPage, loadPendingBookingsCount]);

  useEffect(() => {
    if (isBookingsPage) void loadPendingBookingsCount();
  }, [isBookingsPage, loadPendingBookingsCount]);

  async function handleLogout() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLogoutError(t("admin.configError"));
      return;
    }

    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setLogoutError(t("admin.logoutError"));
        return;
      }

      setIsAuthenticated(false);
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLogoutError(t("admin.logoutError"));
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoginPage) return children;

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background-primary px-4 text-noir-gray">
        <span className="mr-3 size-6 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        {t("admin.sessionCheck")}
      </div>
    );
  }

  if (configurationError) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background-primary px-4">
        <div className="max-w-lg rounded-card border border-red-400/20 bg-red-500/10 p-6 text-center text-sm text-red-100">
          {configurationError}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-svh bg-background-primary text-noir-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-background-secondary/95 p-6 backdrop-blur-xl lg:flex lg:flex-col">
        <Link className="flex items-center gap-3" href="/admin">
          <span className="flex size-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <Menu size={18} />
          </span>
          <span>
            <span className="block font-display text-2xl text-gold-light">
              Noir
            </span>
            <span className="text-[0.6rem] tracking-[0.2em] text-noir-gray uppercase">
              {t("admin.administration")}
            </span>
          </span>
        </Link>

        <nav className="mt-12 grid gap-2">
          {navigation.map(({ href, labelKey, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(`${href}/`));
            const showBookingsBadge =
              href === "/admin/bookings" && pendingBookingsCount > 0;

            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
                  isActive
                    ? "bg-gold text-background-primary"
                    : "text-noir-gray hover:bg-white/[0.05] hover:text-gold-light",
                )}
                href={href}
                key={href}
              >
                <Icon size={17} />
                <span className="min-w-0 flex-1">{t(labelKey)}</span>
                {showBookingsBadge && (
                  <span
                    aria-label={`${pendingBookingsCount} ${t("admin.pendingBookings")}`}
                    className={cn(
                      "ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold",
                      isActive
                        ? "bg-background-primary text-gold"
                        : "bg-gold text-background-primary",
                    )}
                  >
                    {pendingBookingsCount > 99 ? "99+" : pendingBookingsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <LanguageSwitcher className="mt-auto mb-3 self-start" />
        <button
          className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-noir-gray transition hover:border-gold/30 hover:text-gold-light"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={17} />
          {isLoggingOut ? t("admin.exiting") : t("admin.logout")}
        </button>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-background-primary/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link className="font-display text-2xl text-gold-light lg:hidden" href="/admin">
            Noir Admin
          </Link>
          <p className="hidden text-xs tracking-[0.18em] text-noir-gray uppercase lg:block">
            Noir Cocktail Bar
          </p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="inline-flex items-center gap-2 text-xs font-semibold text-noir-gray transition hover:text-gold-light lg:hidden"
              disabled={isLoggingOut}
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={15} />
              {isLoggingOut ? t("admin.exiting") : t("admin.exit")}
            </button>
          </div>
        </div>

        {logoutError && (
          <p className="mx-auto mt-3 max-w-7xl rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {logoutError}
          </p>
        )}

        <nav className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:hidden">
          {navigation.map(({ href, labelKey }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(`${href}/`));
            const showBookingsBadge =
              href === "/admin/bookings" && pendingBookingsCount > 0;

            return (
              <Link
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                  isActive
                    ? "border-gold bg-gold text-background-primary"
                    : "border-white/10 text-noir-gray",
                )}
                href={href}
                key={href}
              >
                {t(labelKey)}
                {showBookingsBadge && (
                  <span
                    aria-label={`${pendingBookingsCount} ${t("admin.pendingBookings")}`}
                    className={cn(
                      "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.62rem] font-bold",
                      isActive
                        ? "bg-background-primary text-gold"
                        : "bg-gold text-background-primary",
                    )}
                  >
                    {pendingBookingsCount > 99 ? "99+" : pendingBookingsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:ml-64 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
