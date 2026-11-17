// Simulador de sensor: substitui o ESP32 (Wokwi) na demonstração.
// O ESP32 real enviaria o mesmo formato de leitura: { t, nivel, entrada, saida }.
import { ultimaLeitura } from './classification'

const r = (a, z) => a + Math.random() * (z - a)
const um = (n) => Math.round(n * 10) / 10

export const CENARIOS = {
  normal: { rotulo: 'Tempo seco', ajuda: 'O nível baixa e o fluxo se normaliza.' },
  chuva: { rotulo: 'Chuva forte', ajuda: 'Entra e sai mais água; o nível sobe junto.' },
  obstrucao: { rotulo: 'Entupimento', ajuda: 'A entrada continua, mas a saída despenca.' },
}

export function gerarLeitura(b, cenario) {
  const ant = ultimaLeitura(b) || { nivel: 10, entrada: 20, saida: 20 }
  let entrada, saida, nivel
  if (cenario === 'chuva') {
    entrada = Math.min(120, ant.entrada * r(1.2, 1.6) + 8)
    saida = entrada * r(0.85, 0.97)
    nivel = ant.nivel + r(4, 8)
  } else if (cenario === 'obstrucao') {
    entrada = Math.max(ant.entrada, 35) * r(0.95, 1.1)
    saida = Math.min(ant.saida, entrada) * r(0.4, 0.6)
    nivel = ant.nivel + r(4, 8)
  } else {
    entrada = r(10, 30)
    saida = entrada * r(0.92, 1)
    nivel = ant.nivel - r(4, 9)
  }
  nivel = Math.min(b.profundidade, Math.max(2, nivel))
  return { t: new Date().toISOString(), nivel: um(nivel), entrada: um(entrada), saida: um(saida) }
}
