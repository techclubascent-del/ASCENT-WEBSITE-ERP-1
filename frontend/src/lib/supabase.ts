// ─────────────────────────────────────────────────────────────────────────────
// Supabase browser client
//
// Use this in Client Components and hooks.
// Do NOT use this in Server Components — use supabase-server.ts instead.
// ─────────────────────────────────────────────────────────────────────────────
import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser (Client Component) contexts.
 * Reads credentials from public environment variables.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
