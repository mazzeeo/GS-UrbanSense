import { LIMITES } from '../lib/classification'

const COR = { normal: 'bg-green-600', atencao: 'bg-amber-500', critico: 'bg-red-600' }

export default function WaterLevelBar({ pct, status }) {
  return (
    <div>
      <div
        role="meter" aria-label="Nível da água" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
        className="relative h-4 rounded-full bg-slate-200 overflow-hidden"
      >
        <div className={`h-full transition-all ${COR[status]}`} style={{ width: `${pct}%` }} />
        <span className="absolute top-0 h-full w-0.5 bg-slate-700/70" style={{ left: `${LIMITES.atencaoPct}%` }} />
        <span className="absolute top-0 h-full w-0.5 bg-slate-900" style={{ left: `${LIMITES.criticoPct}%` }} />
      </div>
      <p className="mt-1 text-sm text-slate-700">{pct}% da profundidade</p>
    </div>
  )
}
