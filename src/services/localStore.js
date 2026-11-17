
const KEY = 'urbansense:bueiros'
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
