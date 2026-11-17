<<<<<<< HEAD
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
=======
// Camada de acesso a dados: CRUD completo do recurso /bueiros em uma API REST externa (MockAPI).
import { localApi } from './localStore'

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const KEY = import.meta.env.VITE_API_KEY || ''
export const modoDemo = !BASE

// Garante o formato esperado pelo app, mesmo se a API devolver dados de outro jeito
// (ex.: registro gerado automaticamente com campos aleatórios).
const normalizar = (b) => ({
  ...b,
  id: b.id ?? b._id ?? b.uuid,
  lat: Number(b.lat),
  lng: Number(b.lng),
  profundidade: Number(b.profundidade) > 0 ? Number(b.profundidade) : 120,
  leituras: Array.isArray(b.leituras) ? b.leituras : [],
  manutencoes: Array.isArray(b.manutencoes) ? b.manutencoes : [],
})

async function http(caminho, opcoes = {}) {
  const res = await fetch(`${BASE}${caminho}`, {
    headers: { 'Content-Type': 'application/json', ...(KEY ? { 'x-api-key': KEY } : {}) },
    ...opcoes,
  })
  if (!res.ok) {
    const dicas = {
      400: 'Pedido recusado pela API (400). Confira se o bueiro tem um id válido.',
      401: 'Chave da API ausente ou inválida (401). Confira VITE_API_KEY.',
      403: 'A API recusou a operação (403). No plano gratuito o limite é de 25 registros por modelo; exclua bueiros ou aguarde o reset diário.',
    }
    throw new Error(dicas[res.status] || `A API respondeu com erro ${res.status}. Tente de novo em instantes.`)
  }
>>>>>>> bfba7e9 (Fazendo a API)
  return res.status === 204 ? null : res.json()
}

const remota = {
<<<<<<< HEAD
  list: () => http('/bueiros'),
  create: (dados) => http('/bueiros', { method: 'POST', body: JSON.stringify(dados) }),
  update: (id, dados) => http(`/bueiros/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
=======
  list: async () => {
    const dados = await http('/bueiros')
    return Array.isArray(dados) ? dados.map(normalizar) : []
  },
  create: async (dados) => normalizar(await http('/bueiros', { method: 'POST', body: JSON.stringify(dados) })),
  update: async (id, dados) => normalizar(await http(`/bueiros/${id}`, { method: 'PUT', body: JSON.stringify(dados) })),
>>>>>>> bfba7e9 (Fazendo a API)
  remove: (id) => http(`/bueiros/${id}`, { method: 'DELETE' }),
}

export const manholeApi = modoDemo ? localApi : remota
