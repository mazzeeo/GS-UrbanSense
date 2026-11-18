// Camada de acesso a dados: CRUD completo do recurso de bueiros em uma API REST externa (MockAPI.io).
import { localApi } from './localStore'

const BASE = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')
const KEY = import.meta.env.VITE_API_KEY || ''
export const modoDemo = !BASE

// VITE_API_URL pode ser a URL do recurso (ex.: https://xxxx.mockapi.io/urbansenseAPI/Bueiros)
// ou só a base do projeto; nesse caso o recurso /bueiros é adicionado.
export const RECURSO = /\/bueiros$/i.test(BASE) ? BASE : `${BASE}/bueiros`

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
  const res = await fetch(`${RECURSO}${caminho}`, {
    headers: { 'Content-Type': 'application/json', ...(KEY ? { 'x-api-key': KEY } : {}) },
    ...opcoes,
  })
  if (!res.ok) {
    const dicas = {
      400: 'Pedido recusado pela API (400). Confira se o bueiro tem um id válido.',
      401: 'Chave da API ausente ou inválida (401). Confira VITE_API_KEY.',
      403: 'A API recusou a operação (403). No plano gratuito há limite de registros; exclua bueiros antigos.',
    }
    throw new Error(dicas[res.status] || `A API respondeu com erro ${res.status}. Tente de novo em instantes.`)
  }
  return res.status === 204 ? null : res.json()
}

const remota = {
  list: async () => {
    const dados = await http('')
    return Array.isArray(dados) ? dados.map(normalizar) : []
  },
  create: async (dados) => normalizar(await http('', { method: 'POST', body: JSON.stringify(dados) })),
  update: async (id, dados) => normalizar(await http(`/${id}`, { method: 'PUT', body: JSON.stringify(dados) })),
  remove: (id) => http(`/${id}`, { method: 'DELETE' }),
}

export const manholeApi = modoDemo ? localApi : remota
