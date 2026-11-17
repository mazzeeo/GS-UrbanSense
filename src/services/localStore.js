<<<<<<< HEAD

const KEY = 'urbansense:bueiros'
=======
// Armazenamento local usado SOMENTE no modo demonstração (sem VITE_API_URL).
// Tem a mesma interface da API externa para o resto do app não perceber a diferença.
const KEY = 'drenaalerta:bueiros'
>>>>>>> bfba7e9 (Fazendo a API)
const ler = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const gravar = (v) => localStorage.setItem(KEY, JSON.stringify(v))

export const localApi = {
  async list() { return ler() },
  async create(dados) {
    const item = { ...dados, id: crypto.randomUUID() }
    gravar([...ler(), item])
    return item
  },
  async update(id, dados) {
    const item = { ...dados, id }
    gravar(ler().map((x) => (x.id === id ? item : x)))
    return item
  },
  async remove(id) { gravar(ler().filter((x) => x.id !== id)); return null },
}
