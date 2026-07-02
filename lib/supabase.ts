import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import type { Database } from "./supabase/types";

let supabaseClient:
  | SupabaseClient<Database>
  | null
  | undefined;

export function getSupabaseClient(): SupabaseClient<Database> | null {
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
    supabaseClient = createClient<Database>(url, anonKey, {
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
