// Teste rápido da API externa: cria, lê, edita e exclui um bueiro de teste.
// Uso: npm run test:api   (lê VITE_API_URL do .env ou do ambiente)
import { readFileSync, existsSync } from 'node:fs'

function lerEnv() {
  const env = { ...process.env }
  for (const arq of ['.env', '.env.example']) {
    if (env.VITE_API_URL || !existsSync(arq)) continue
    for (const linha of readFileSync(arq, 'utf8').split(/\r?\n/)) {
      const m = linha.match(/^\s*(VITE_API_[A-Z_]+)\s*=\s*(.*)\s*$/)
      if (m && !env[m[1]]) env[m[1]] = m[2]
    }
  }
  return env
}

const env = lerEnv()
const BASE = (env.VITE_API_URL || '').trim().replace(/\/+$/, '')
if (!BASE) {
  console.error('VITE_API_URL não definida. Copie .env.example para .env.')
  process.exit(1)
}
const RECURSO = /\/bueiros$/i.test(BASE) ? BASE : `${BASE}/bueiros`
const headers = { 'Content-Type': 'application/json', ...(env.VITE_API_KEY ? { 'x-api-key': env.VITE_API_KEY } : {}) }

async function chamar(metodo, caminho = '', corpo) {
  const res = await fetch(`${RECURSO}${caminho}`, { method: metodo, headers, body: corpo && JSON.stringify(corpo) })
  if (!res.ok) throw new Error(`${metodo} ${caminho || '/'} -> HTTP ${res.status}`)
  return res.json()
}

const ok = (cond, msg) => { if (!cond) throw new Error(`Falhou: ${msg}`); console.log(`  ok  ${msg}`) }

console.log(`Testando ${RECURSO}`)
let id
try {
  const lista = await chamar('GET')
  ok(Array.isArray(lista), `GET lista (${lista.length} bueiros)`)

  const novo = await chamar('POST', '', {
    nome: 'Bueiro de teste (apagar)', bairro: 'Bela Vista', endereco: 'Teste automático',
    lat: -23.5614, lng: -46.6559, profundidade: 120,
    leituras: [{ t: Date.now(), nivel: 10, entrada: 2, saida: 2 }], manutencoes: [],
  })
  id = novo.id
  ok(id, `POST cria bueiro (id ${id})`)

  const lido = await chamar('GET', `/${id}`)
  ok(lido.nome === 'Bueiro de teste (apagar)' && lido.leituras.length === 1, 'GET /:id devolve o bueiro criado')

  const editado = await chamar('PUT', `/${id}`, { ...lido, leituras: [...lido.leituras, { t: Date.now(), nivel: 40, entrada: 5, saida: 2 }] })
  ok(editado.leituras.length === 2, 'PUT /:id grava nova leitura')

  await chamar('DELETE', `/${id}`)
  id = null
  const depois = await chamar('GET')
  ok(!depois.some((b) => b.id === novo.id), 'DELETE /:id remove o bueiro')

  console.log('API funcionando: CRUD completo OK.')
} catch (e) {
  console.error(`  ERRO ${e.message}`)
  if (id) await chamar('DELETE', `/${id}`).catch(() => {})
  process.exit(1)
}
