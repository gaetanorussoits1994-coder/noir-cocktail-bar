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
import { useEffect, useState } from "react";

import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Prenotazioni", icon: Users },
  { href: "/admin/menu", label: "Menu", icon: Martini },
  { href: "/admin/events", label: "Eventi", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [isLoading, setIsLoading] = useState(!isLoginPage);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoginPage);
  const [configurationError, setConfigurationError] = useState("");

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      setConfigurationError(
        "Configurazione Supabase mancante. Verifica le variabili d'ambiente.",
      );
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      if (!data.session?.user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace("/admin/login");
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session?.user) {
        setIsAuthenticated(false);
        router.replace("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase?.auth.signOut();
    router.replace("/admin/login");
  }

  if (isLoginPage) return children;

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background-primary px-4 text-noir-gray">
        <span className="mr-3 size-6 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        Verifica sessione...
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
              Administration
            </span>
          </span>
        </Link>

        <nav className="mt-12 grid gap-2">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(`${href}/`));

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
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          className="mt-auto flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-noir-gray transition hover:border-gold/30 hover:text-gold-light"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={17} />
          Logout
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
          <button
            className="inline-flex items-center gap-2 text-xs font-semibold text-noir-gray transition hover:text-gold-light lg:hidden"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={15} />
            Esci
          </button>
        </div>

        <nav className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:hidden">
          {navigation.map(({ href, label }) => (
            <Link
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs",
                pathname === href
                  ? "border-gold bg-gold text-background-primary"
                  : "border-white/10 text-noir-gray",
              )}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:ml-64 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
