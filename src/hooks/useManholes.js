import { useCallback, useEffect, useRef, useState } from 'react'
import { manholeApi } from '../services/manholeApi'
import { montarSeed } from '../data/seed'

const INTERVALO_MS = 15000

// Custom hook 1: estado dos bueiros + CRUD + atualização periódica.
// Um ESP32 que envie leituras para a API aparece aqui sem recarregar a página.
export function useManholes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  // Enquanto uma gravação está em andamento, a atualização automática espera,
  // para não sobrescrever a lista com dados antigos.
  const gravando = useRef(0)

  const carregar = useCallback(async (silencioso = false) => {
    if (silencioso && gravando.current > 0) return
    try {
      if (!silencioso) setLoading(true)
      const dados = await manholeApi.list()
      if (silencioso && gravando.current > 0) return
      setItems(Array.isArray(dados) ? dados : [])
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      if (!silencioso) setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
    // Só consulta a API com a aba visível; ao voltar para a aba, atualiza na hora.
    const id = setInterval(() => { if (!document.hidden) carregar(true) }, INTERVALO_MS)
    const aoVoltar = () => { if (!document.hidden) carregar(true) }
    document.addEventListener('visibilitychange', aoVoltar)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', aoVoltar)
    }
  }, [carregar])

  const executar = async (fn) => {
    gravando.current += 1
    setBusy(true)
    try {
      const r = await fn()
      setError(null)
      return r
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      gravando.current -= 1
      setBusy(gravando.current > 0)
    }
  }

  const criar = (dados) =>
    executar(async () => {
      const novo = await manholeApi.create(dados)
      setItems((p) => [...p, novo])
      return novo
    })

  const atualizar = (id, dados) =>
    executar(async () => {
      const novo = await manholeApi.update(id, dados)
      setItems((p) => p.map((x) => (x.id === id ? novo : x)))
      return novo
    })

  const remover = (id) =>
    executar(async () => {
      await manholeApi.remove(id)
      setItems((p) => p.filter((x) => x.id !== id))
      return true
    })

  // Cria um por vez e já mostra cada bueiro criado; se a API falhar no meio,
  // os que já foram gravados continuam na tela.
  const carregarExemplos = () =>
    executar(async () => {
      for (const s of montarSeed()) {
        const novo = await manholeApi.create(s)
        setItems((p) => [...p, novo])
      }
      return true
    })

  return { items, loading, busy, error, recarregar: () => carregar(), criar, atualizar, remover, carregarExemplos }
}
