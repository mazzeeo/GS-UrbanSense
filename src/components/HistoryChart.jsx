import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts'
import { fmtHora } from '../lib/format'
import { LIMITES } from '../lib/classification'

export default function HistoryChart({ b }) {
  const dados = (b.leituras || []).map((l) => ({ hora: fmtHora(l.t), nivel: l.nivel, entrada: l.entrada, saida: l.saida }))
  if (dados.length < 2) return <p className="text-slate-700">O histórico aparece a partir de duas leituras do sensor.</p>

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold mb-1">Nível da água (cm)</h3>
        <div role="img" aria-label={`Gráfico do nível da água nas últimas ${dados.length} leituras`}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dados} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="hora" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, b.profundidade]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <ReferenceLine y={(b.profundidade * LIMITES.atencaoPct) / 100} stroke="#b45309" strokeDasharray="5 4" label={{ value: 'Atenção', fontSize: 11, fill: '#b45309', position: 'insideTopLeft' }} />
              <ReferenceLine y={(b.profundidade * LIMITES.criticoPct) / 100} stroke="#b91c1c" strokeDasharray="5 4" label={{ value: 'Crítico', fontSize: 11, fill: '#b91c1c', position: 'insideTopLeft' }} />
              <Line type="monotone" dataKey="nivel" name="Nível (cm)" stroke="#0b6e8a" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-1">Entrada × saída de água (L/min)</h3>
        <p className="text-sm text-slate-700 mb-1">Se a entrada se mantém e a saída cai, é sinal de entupimento.</p>
        <div role="img" aria-label="Gráfico comparando a entrada e a saída de água">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dados} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="hora" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="entrada" name="Entrada" stroke="#0f2a43" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="saida" name="Saída" stroke="#d97706" strokeWidth={2} strokeDasharray="6 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
