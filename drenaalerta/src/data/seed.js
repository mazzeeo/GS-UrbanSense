// Dados SIMULADOS para demonstração. Locais aproximados; nenhum dado pessoal.
const serie = (perfil) => {
  const agora = Date.now()
  return perfil.map(([nivel, entrada, saida], i) => ({
    t: new Date(agora - (perfil.length - 1 - i) * 10 * 60000).toISOString(),
    nivel, entrada, saida,
  }))
}

const NORMAL = [[12, 20, 20], [11, 18, 18], [13, 22, 21], [12, 20, 20], [10, 19, 19], [12, 21, 20]]
const CHUVA = [[30, 40, 38], [36, 48, 45], [42, 55, 52], [48, 60, 57], [54, 64, 61], [60, 66, 63]]
const ENTUPIDO = [[15, 30, 29], [20, 35, 26], [28, 38, 22], [35, 40, 18], [44, 40, 14], [52, 41, 12]]
const CRITICO = [[40, 50, 40], [55, 55, 35], [70, 58, 28], [85, 60, 22], [96, 60, 18], [104, 60, 15]]
const ENTUPIDO_LEVE = [[10, 25, 24], [14, 26, 20], [18, 26, 16], [22, 27, 13], [27, 27, 11]]

export function montarSeed() {
  const dias2 = new Date(Date.now() - 2 * 86400000).toISOString()
  const base = [
    ['BQ-001 · Av. Paulista, 1000', 'Bela Vista', 'Av. Paulista, altura do nº 1000', -23.5649, -46.6522, 120, NORMAL],
    ['BQ-002 · Rua Augusta com Al. Santos', 'Cerqueira César', 'Rua Augusta x Alameda Santos', -23.5644, -46.6561, 120, CHUVA],
    ['BQ-003 · Av. 23 de Maio com Vergueiro', 'Paraíso', 'Av. 23 de Maio x Rua Vergueiro', -23.5714, -46.6422, 120, CRITICO],
    ['BQ-004 · Rua da Consolação', 'Consolação', 'Rua da Consolação x Rua Maceió', -23.5517, -46.6574, 120, NORMAL],
    ['BQ-005 · Vale do Anhangabaú', 'Centro', 'Vale do Anhangabaú, lado Viaduto do Chá', -23.546, -46.6388, 120, ENTUPIDO],
    ['BQ-006 · Av. Brigadeiro Luís Antônio', 'Bela Vista', 'Av. Brigadeiro Luís Antônio, 900', -23.5669, -46.6471, 120, NORMAL],
    ['BQ-007 · Rua da Glória', 'Liberdade', 'Rua da Glória, 300', -23.5562, -46.6354, 100, ENTUPIDO_LEVE],
    ['BQ-008 · Rua Pamplona', 'Jardim Paulista', 'Rua Pamplona, 500', -23.5703, -46.6567, 120, NORMAL],
  ]
  return base.map(([nome, bairro, endereco, lat, lng, profundidade, perfil], i) => ({
    nome, bairro, endereco, lat, lng, profundidade,
    leituras: serie(perfil),
    manutencoes: i === 3
      ? [{ data: dias2, tipo: 'limpeza', responsavel: 'Equipe de zeladoria (exemplo)', obs: 'Retirada de folhas e sedimentos.' }]
      : [],
  }))
}
