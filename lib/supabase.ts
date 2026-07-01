import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient !== undefined) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    supabaseClient = null;
    return supabaseClient;
  }

  try {
    supabaseClient = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
  } catch {
    supabaseClient = null;
  }

  return supabaseClient;
}
