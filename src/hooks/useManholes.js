import { useCallback, useEffect, useState } from 'react'
import { manholeApi } from '../services/manholeApi'
import { montarSeed } from '../data/seed'

// Custom hook 1: estado dos bueiros + CRUD + atualização periódica.
// Um ESP32 que envie leituras para a API aparece aqui sem recarregar a página.
export function useManholes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const carregar = useCallback(async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true)
      const dados = await manholeApi.list()
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
    const id = setInterval(() => carregar(true), 15000)
    return () => clearInterval(id)
  }, [carregar])

  const executar = async (fn) => {
    setBusy(true)
    try {
      const r = await fn()
      setError(null)
      return r
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setBusy(false)
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

  const carregarExemplos = () =>
    executar(async () => {
      const criados = []
      for (const s of montarSeed()) criados.push(await manholeApi.create(s))
      setItems((p) => [...p, ...criados])
      return true
    })

  return { items, loading, busy, error, recarregar: () => carregar(), criar, atualizar, remover, carregarExemplos }
}
