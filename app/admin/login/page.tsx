"use client";

import { ArrowRight, LockKeyhole, Martini } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const { locale, t } = useTranslation();
  const copy =
    locale === "it"
      ? {
          intro: "Accedi per gestire prenotazioni, menu ed esperienze Noir.",
          signIn: "Accedi",
          signingIn: "Accesso in corso...",
          invalid: "Email o password non corrette.",
          unavailable: "Configurazione Supabase non disponibile.",
          connection: "Impossibile contattare il servizio di autenticazione. Riprova tra poco.",
          expired: "La sessione e scaduta. Accedi nuovamente.",
        }
      : {
          intro: "Sign in to manage bookings, menus and Noir experiences.",
          signIn: "Sign in",
          signingIn: "Signing in...",
          invalid: "Incorrect email or password.",
          unavailable: "Supabase configuration is unavailable.",
          connection: "Unable to contact the authentication service. Please try again shortly.",
          expired: "Your session expired. Please sign in again.",
        };
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let isMounted = true;

    if (!supabase) {
      setIsCheckingSession(false);
      return;
    }

    if (
      new URLSearchParams(window.location.search).get("reason") ===
      "session_expired"
    ) {
      setError(copy.expired);
    }

    void supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!isMounted) return;

        if (data.user) {
          router.replace("/admin");
          return;
        }

        setIsCheckingSession(false);
      })
      .catch(() => {
        if (isMounted) setIsCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, [copy.expired, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(copy.unavailable);
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError || !data.session || !data.user) {
        setError(copy.invalid);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError(copy.connection);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background-primary px-4 py-12 text-noir-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(200,169,106,0.14),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px]"
      />

      <section className="relative z-10 w-full max-w-md rounded-[1.5rem] border border-gold/20 bg-background-secondary/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-9">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold shadow-gold">
            <Martini size={23} strokeWidth={1.5} />
          </span>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[0.65rem] font-semibold tracking-[0.26em] text-gold uppercase">
            Private access
          </p>
          <h1 className="mt-3 font-display text-4xl text-gold-light">
            Noir Administration
          </h1>
          <p className="mt-3 text-sm leading-6 text-noir-gray">
            {copy.intro}
          </p>
        </div>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label>
            <span className="mb-2 block text-[0.68rem] font-semibold tracking-[0.15em] text-gold uppercase">
              Email
            </span>
            <input
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-gold/60 focus:ring-2 focus:ring-gold/10"
              disabled={isCheckingSession || isSubmitting}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@dominio.it"
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            <span className="mb-2 block text-[0.68rem] font-semibold tracking-[0.15em] text-gold uppercase">
              Password
            </span>
            <div className="relative">
              <LockKeyhole
                className="absolute top-1/2 left-4 -translate-y-1/2 text-noir-gray"
                size={16}
              />
              <input
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-black/35 py-3.5 pr-4 pl-11 text-sm outline-none transition placeholder:text-white/25 focus:border-gold/60 focus:ring-2 focus:ring-gold/10"
                disabled={isCheckingSession || isSubmitting}
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>
          </label>

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <button
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gold bg-gold px-5 py-3.5 text-sm font-semibold text-background-primary shadow-gold transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCheckingSession || isSubmitting}
            type="submit"
          >
            {isCheckingSession
              ? t("admin.sessionCheck")
              : isSubmitting
                ? copy.signingIn
                : copy.signIn}
            {!isCheckingSession && !isSubmitting && <ArrowRight size={17} />}
          </button>
        </form>
      </section>
    </main>
  );
}
