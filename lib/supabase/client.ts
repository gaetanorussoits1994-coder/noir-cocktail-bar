import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseClient } from "../supabase";
import type { Database } from "./types";

export type BrowserSupabaseClient = SupabaseClient<Database>;
export { getSupabaseClient };
