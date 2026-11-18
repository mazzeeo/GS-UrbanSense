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

// Monta o corpo enviado à API: sem o id (ele vai na URL), números como números
// e histórico limitado para o registro não crescer sem fim no MockAPI.
const MAX_LEITURAS = 96
const MAX_MANUTENCOES = 50
const preparar = ({ id, _id, uuid, createdAt, ...b }) => ({
  ...b,
  lat: Number(b.lat),
  lng: Number(b.lng),
  profundidade: Number(b.profundidade),
  leituras: (Array.isArray(b.leituras) ? b.leituras : []).slice(-MAX_LEITURAS),
  manutencoes: (Array.isArray(b.manutencoes) ? b.manutencoes : []).slice(-MAX_MANUTENCOES),
})

const TIMEOUT_MS = 10000
const TENTATIVAS = 3
const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

// Erros temporários (limite de requisições ou servidor fora do ar) valem nova tentativa.
const temporario = (status) => status === 429 || status >= 500

const DICAS = {
  400: 'Pedido recusado pela API (400). Confira se o bueiro tem um id válido.',
  401: 'Chave da API ausente ou inválida (401). Confira VITE_API_KEY.',
  403: 'A API recusou a operação (403). No plano gratuito há limite de registros; exclua bueiros antigos.',
  404: 'Bueiro ou recurso não encontrado na API (404). Confira VITE_API_URL ou atualize a lista.',
  429: 'Muitas requisições seguidas para a API (429). Aguarde alguns segundos e tente de novo.',
}

async function http(caminho, opcoes = {}) {
  for (let tentativa = 1; ; tentativa++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    let res
    try {
      res = await fetch(`${RECURSO}${caminho}`, {
        headers: { 'Content-Type': 'application/json', ...(KEY ? { 'x-api-key': KEY } : {}) },
        signal: ctrl.signal,
        ...opcoes,
      })
    } catch (e) {
      if (tentativa < TENTATIVAS) { await esperar(500 * tentativa); continue }
      throw new Error(e.name === 'AbortError'
        ? 'A API demorou demais para responder. Confira sua conexão e tente de novo.'
        : 'Não foi possível conectar à API. Confira sua conexão e a VITE_API_URL.')
    } finally {
      clearTimeout(timer)
    }
    if (res.ok) return res.status === 204 ? null : res.json()
    if (temporario(res.status) && tentativa < TENTATIVAS) { await esperar(800 * tentativa); continue }
    throw new Error(DICAS[res.status] || `A API respondeu com erro ${res.status}. Tente de novo em instantes.`)
  }
}

const remota = {
  list: async () => {
    const dados = await http('')
    return Array.isArray(dados) ? dados.map(normalizar) : []
  },
  get: async (id) => normalizar(await http(`/${encodeURIComponent(id)}`)),
  create: async (dados) => normalizar(await http('', { method: 'POST', body: JSON.stringify(preparar(dados)) })),
  update: async (id, dados) =>
    normalizar(await http(`/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(preparar(dados)) })),
  remove: (id) => http(`/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}

export const manholeApi = modoDemo ? localApi : remota
