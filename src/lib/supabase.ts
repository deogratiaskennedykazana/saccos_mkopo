import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '⚠ Supabase environment variables are missing.\n' +
    'Copy .env.example → .env.local and fill in your credentials.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: number
  jina_kamili: string
  namba_mwanachama?: string
  simu?: string
  anuani_posta?: string
  kata?: string
  mtaa?: string
  namba_nyumba?: string
}

export type LoanPayload = {
  form_number: string
  applicant_id: number
  anuani_posta?: string
  namba_simu?: string
  kata?: string
  mtaa?: string
  namba_nyumba?: string
  idadi_wategemezi?: number | null
  kiasi_tarakimu?: number | null
  kiasi_maneno?: string
  riba_asilimia?: number | null
  riba_tshs?: number | null
  muda_miezi?: number | null
  rejesho_mwezi?: number | null
  madhumuni_1?: string
  madhumuni_2?: string
  madhumuni_3?: string
  dhamana_hisa_kiasi?: number | null
  dhamana_hisa_thamani?: number | null
  dhamana_akiba?: number | null
  dhamana_mali_zingine?: string
  ana_akaunti?: string
  benki_1_jina?: string
  benki_1_ac?: string
  benki_2_jina?: string
  benki_2_ac?: string
  benki_3_jina?: string
  benki_3_ac?: string
  ana_mkopo_benki?: string
  prev_mikopo?: object[]
  mdhamini_1_id: number
  mdhamini_1_hisa_kiasi?: number | null
  mdhamini_1_hisa_thamani?: number | null
  mdhamini_1_akiba?: number | null
  mdhamini_1_kiasi?: number | null
  mdhamini_1_amana?: number | null
  mdhamini_1_simu?: string
  mdhamini_1_tarehe?: string | null
  mdhamini_2_id: number
  mdhamini_2_hisa_kiasi?: number | null
  mdhamini_2_hisa_thamani?: number | null
  mdhamini_2_akiba?: number | null
  mdhamini_2_kiasi?: number | null
  mdhamini_2_amana?: number | null
  mdhamini_2_simu?: string
  mdhamini_2_tarehe?: string | null
  tarehe_fungu_kwanza?: string | null
  tarehe_mwisho?: string | null
  sahihi_data?: string | null
  tarehe_kusaini?: string | null
  tarehe_kupokea?: string | null
  off_kiasi_kuombwa?: number | null
  off_kiasi_pendekezwa?: number | null
  off_muda_miezi?: number | null
  off_tarehe_kuanzia?: string | null
  off_tarehe_hadi?: string | null
  off_riba?: number | null
  off_rejesho_mwezi?: number | null
  off_afisa_sahihi?: string
  off_afisa_simu?: string
  off_afisa_tarehe?: string | null
  kamati_kiasi?: number | null
  kamati_tarehe?: string | null
  kamati_muda?: number | null
  kamati_riba?: number | null
  kamati_rejesho?: number | null
  status_kukubaliwa?: boolean
  status_kukataliwa?: boolean
  status_kuahirishwa?: boolean
  kamati_maoni?: string
  ap_jina_1?: string; ap_sahihi_1?: string
  ap_jina_2?: string; ap_sahihi_2?: string
  ap_jina_3?: string; ap_sahihi_3?: string
  ap_jina_4?: string; ap_sahihi_4?: string
  ap_jina_5?: string; ap_sahihi_5?: string
  hati_malipo_na?: string
  hundi_na?: string
  saini_mhasibu?: string
  created_at: string
  status: string
}
