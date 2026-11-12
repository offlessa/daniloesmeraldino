import { supabase } from '../lib/supabase'

// Configurações privadas (tabela admin_settings: só o administrador logado lê e altera)
export type SettingKey = 'deploy_hook' | 'resend_apikey'

export async function readSettings(): Promise<Partial<Record<SettingKey, string>>> {
  const { data } = await supabase.from('admin_settings').select('key, value')
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
}

export async function saveSettings(values: Partial<Record<SettingKey, string>>) {
  const rows = Object.entries(values).map(([key, value]) => ({
    key,
    value: (value ?? '').trim(),
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('admin_settings').upsert(rows)
  if (error) throw error
}

/**
 * E-mail de teste pelo Resend. Quem envia é o banco (a chave nunca passa pelo navegador).
 * false = falta salvar a chave.
 */
export async function testEmail(): Promise<boolean> {
  const { data, error } = await supabase.rpc('testar_aviso_email')
  if (error) throw error
  return data === true
}

/**
 * Pede para a Vercel publicar o site de novo: o Google e o WhatsApp passam a ler os títulos,
 * textos e fotos atuais das obras (inclusive as criadas pelo painel). Leva uns 2 minutos.
 */
export async function rebuildSite(): Promise<'ok' | 'missing'> {
  const { deploy_hook } = await readSettings()
  if (!deploy_hook || !/^https:\/\/api\.vercel\.com\//.test(deploy_hook)) return 'missing'
  // A Vercel não responde para páginas de outro endereço (CORS), mas o pedido chega
  await fetch(deploy_hook, { method: 'POST', mode: 'no-cors' })
  return 'ok'
}
