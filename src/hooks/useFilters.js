import { useMemo, useState } from 'react'
import { classificar, ORDEM } from '../lib/classification'

const porGravidade = (x, y) => ORDEM[x.c.status] - ORDEM[y.c.status] || y.c.pct - x.c.pct

// Custom hook 2: classifica cada bueiro e deriva contagens, alertas e lista filtrada.
export function useFilters(items) {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('todos')

  const todos = useMemo(() => items.map((b) => ({ b, c: classificar(b) })), [items])

  const contagem = useMemo(() => ({
    total: todos.length,
    normal: todos.filter(({ c }) => c.status === 'normal').length,
    atencao: todos.filter(({ c }) => c.status === 'atencao').length,
    critico: todos.filter(({ c }) => c.status === 'critico').length,
  }), [todos])

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return todos
      .filter(({ b, c }) =>
        (status === 'todos' || c.status === status) &&
        (!q || `${b.nome} ${b.bairro} ${b.endereco}`.toLowerCase().includes(q)))
      .sort(porGravidade)
  }, [todos, busca, status])

  const alertas = useMemo(() => todos.filter(({ c }) => c.pendente).sort(porGravidade), [todos])

  return { todos, filtrados, alertas, contagem, busca, setBusca, status, setStatus }
}
