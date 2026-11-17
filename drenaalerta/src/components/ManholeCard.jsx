import StatusBadge from './StatusBadge'
import WaterLevelBar from './WaterLevelBar'
import { ultimaLeitura } from '../lib/classification'
import { tempoRelativo } from '../lib/format'

export default function ManholeCard({ b, c, selecionado, onSelect }) {
  const l = ultimaLeitura(b)
  return (
    <li>
      <button
        type="button" aria-pressed={selecionado} onClick={() => onSelect(b.id)}
        className={`w-full text-left rounded-xl border-2 p-3 bg-white hover:bg-slate-50 ${selecionado ? 'border-brand' : 'border-slate-300'}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold leading-snug">{b.nome}</p>
            <p className="text-sm text-slate-700">{b.bairro}</p>
          </div>
          <StatusBadge status={c.status} />
        </div>
        <div className="mt-2"><WaterLevelBar pct={c.pct} status={c.status} /></div>
        <p className="mt-1 text-xs text-slate-600">{l ? `Última leitura ${tempoRelativo(l.t)}` : 'Sem leituras'}</p>
      </button>
    </li>
  )
}
