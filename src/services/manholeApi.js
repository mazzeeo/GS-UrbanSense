// Camada de acesso a dados: CRUD completo do recurso /bueiros em uma API REST externa.
import { localApi } from './localStore'

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const modoDemo = !BASE

async function http(caminho, opcoes = {}) {
  const res = await fetch(`${BASE}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })
  if (!res.ok) throw new Error(`A API respondeu com erro ${res.status}. Tente de novo em instantes.`)
  return res.status === 204 ? null : res.json()
}

const remota = {
  list: () => http('/bueiros'),
  create: (dados) => http('/bueiros', { method: 'POST', body: JSON.stringify(dados) }),
  update: (id, dados) => http(`/bueiros/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  remove: (id) => http(`/bueiros/${id}`, { method: 'DELETE' }),
}

export const manholeApi = modoDemo ? localApi : remota
