import { useCallback, useEffect, useState } from 'react'
import { gerarLeitura, CENARIOS } from '../lib/simulation'

// Custom hook 3: gera uma leitura simulada e a grava na API (como o ESP32 faria).
export function useSensorSimulator(atualizar) {
  const [ultimo, setUltimo] = useState(null)

  const simular = useCallback(async (b, cenario) => {
    const leitura = gerarLeitura(b, cenario)
    const leituras = [...(b.leituras || []), leitura].slice(-48)
    const ok = await atualizar(b.id, { ...b, leituras })
    if (ok) setUltimo(`Leitura simulada (${CENARIOS[cenario].rotulo.toLowerCase()}) registrada em ${b.nome}.`)
  }, [atualizar])

  useEffect(() => {
    if (!ultimo) return
    const id = setTimeout(() => setUltimo(null), 4000)
    return () => clearTimeout(id)
  }, [ultimo])

  return { simular, aviso: ultimo }
}
