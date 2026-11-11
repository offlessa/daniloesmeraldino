import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabaseConfig'

// Cliente completo (login, gravação e envio de fotos): só o painel usa, e ele é baixado à parte
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export { PHOTO_BUCKET, type PhotoRow, type ProjectRow } from './supabaseConfig'
