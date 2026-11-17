// Regras de negócio: classificação do estado de um bueiro.
// Nenhum componente decide status sozinho: tudo passa por aqui.

export const STATUS_INFO = {
  normal: { label: 'Normal', desc: 'Funcionando normalmente.', icon: '✓' },
  atencao: { label: 'Atenção', desc: 'Possível obstrução. Recomenda-se inspeção.', icon: '!' },
  critico: { label: 'Crítico', desc: 'Risco de transbordamento. Alerta prioritário.', icon: '▲' },
}

export const LIMITES = {
  atencaoPct: 50, // % da profundidade que já exige atenção
  criticoPct: 80, // % da profundidade considerada crítica
  fluxoBaixo: 0.7, // saída/entrada abaixo disso: escoamento abaixo do esperado
  fluxoMuitoBaixo: 0.4,
  subidaRapida: 4, // cm a cada 10 min
}

export const ORDEM = { critico: 0, atencao: 1, normal: 2 }

export const ultimaLeitura = (b) => (b.leituras || []).slice(-1)[0] || null

export const nivelPct = (b, l = ultimaLeitura(b)) =>
  l && b.profundidade ? Math.min(100, Math.round((l.nivel / b.profundidade) * 100)) : 0

// Subida do nível em cm a cada 10 min, olhando as últimas 3 leituras.
export function taxaSubida(b) {
  const ls = b.leituras || []
  if (ls.length < 2) return 0
  const a = ls[Math.max(0, ls.length - 3)]
  const z = ls[ls.length - 1]
  const min = (new Date(z.t) - new Date(a.t)) / 60000
  return min > 0 ? ((z.nivel - a.nivel) / min) * 10 : 0
}

export function classificar(b) {
  const l = ultimaLeitura(b)
  if (!l) {
    return { status: 'normal', motivos: ['Ainda sem leituras do sensor.'], pct: 0, razao: null, taxa: 0, obstrucaoProvavel: false, pendente: false }
  }
  const pct = nivelPct(b, l)
  const razao = l.entrada > 0 ? l.saida / l.entrada : null
  const taxa = taxaSubida(b)
  const fluxoBaixo = razao !== null && razao < LIMITES.fluxoBaixo
  const fluxoMuitoBaixo = razao !== null && razao < LIMITES.fluxoMuitoBaixo
  const subindo = taxa > 0.5
  const subidaRapida = taxa >= LIMITES.subidaRapida
  const obstrucaoProvavel = fluxoBaixo && pct >= 25

  let status = 'normal'
  if (pct >= LIMITES.criticoPct || (pct >= 60 && subindo && (fluxoMuitoBaixo || subidaRapida))) status = 'critico'
  else if (pct >= LIMITES.atencaoPct || obstrucaoProvavel || (subidaRapida && pct >= 25)) status = 'atencao'

  const motivos = []
  if (pct >= LIMITES.criticoPct) motivos.push(`Nível em ${pct}% da profundidade.`)
  else if (pct >= LIMITES.atencaoPct) motivos.push(`Nível elevado: ${pct}% da profundidade.`)
  if (subidaRapida) motivos.push(`Água subindo ${taxa.toFixed(1)} cm a cada 10 min.`)
  if (obstrucaoProvavel) {
    motivos.push(`Entra mais água do que sai (saída em ${Math.round(razao * 100)}% da entrada): indício forte de entupimento.`)
  } else if (status !== 'normal') {
    motivos.push('Escoamento proporcional à entrada: o nível alto é mais provavelmente chuva forte do que entupimento.')
  }
  if (status === 'normal') motivos.push('Nível baixo e escoamento adequado.')

  // Há inspeção pendente quando o bueiro não está normal e ninguém vistoriou depois da última leitura.
  const m = (b.manutencoes || []).slice(-1)[0]
  const jaVistoriado = m && new Date(m.data) >= new Date(l.t)
  return { status, motivos, pct, razao, taxa, obstrucaoProvavel, pendente: status !== 'normal' && !jaVistoriado }
}
