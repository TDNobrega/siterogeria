import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side (formulário + upload de arquivos)
export const supabase = createClient(url, anon)

// Server-side only (admin panel — nunca expor ao cliente)
export function getAdminSupabase() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
