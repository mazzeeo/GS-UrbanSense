export const fmtHora = (iso) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export const fmtDataHora = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function tempoRelativo(iso) {
  const m = Math.round((Date.now() - new Date(iso)) / 60000)
  if (m < 1) return 'agora'
  if (m < 60) return `há ${m} min`
  const h = Math.round(m / 60)
  return h < 24 ? `há ${h} h` : `há ${Math.round(h / 24)} d`
}
