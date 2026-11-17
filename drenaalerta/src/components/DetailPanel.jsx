import StatusBadge from './StatusBadge'
import WaterLevelBar from './WaterLevelBar'
import HistoryChart from './HistoryChart'
import SensorSimulator from './SensorSimulator'
import MaintenancePanel from './MaintenancePanel'
import { STATUS_INFO, ultimaLeitura } from '../lib/classification'
import { tempoRelativo } from '../lib/format'

const FUNDO = { normal: 'bg-green-50 border-green-700', atencao: 'bg-amber-50 border-amber-700', critico: 'bg-red-50 border-red-700' }

function Metrica({ rotulo, valor }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3">
      <p className="text-sm text-slate-700">{rotulo}</p>
      <p className="font-display text-2xl font-extrabold">{valor}</p>
    </div>
  )
}

export default function DetailPanel({ b, c, ocupado, onEditar, onExcluir, onSimular, onRegistrarManutencao }) {
  const l = ultimaLeitura(b)
  return (
    <section className="card p-4 sm:p-6 space-y-5" aria-labelledby="t-det">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="t-det" className="text-2xl font-extrabold leading-tight">{b.nome}</h2>
          <p className="text-slate-700">{b.endereco} · {b.bairro}</p>
        </div>
        <StatusBadge status={c.status} grande />
      </div>

      <div className={`rounded-xl border-2 p-3 ${FUNDO[c.status]}`}>
        <p className="font-bold">{STATUS_INFO[c.status].desc}</p>
        <ul className="mt-1 list-disc pl-5 text-sm space-y-0.5">
          {c.motivos.map((m) => <li key={m}>{m}</li>)}
        </ul>
        {c.pendente && <p className="mt-2 text-sm font-bold">Inspeção pendente: registre a vistoria abaixo.</p>}
      </div>

      {l && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Metrica rotulo="Nível da água" valor={`${l.nivel} cm`} />
            <Metrica rotulo="Entrada" valor={`${l.entrada} L/min`} />
            <Metrica rotulo="Saída" valor={`${l.saida} L/min`} />
            <Metrica rotulo="Tendência" valor={`${c.taxa >= 0 ? '+' : ''}${c.taxa.toFixed(1)} cm/10 min`} />
          </div>
          <p className="mt-2 text-sm text-slate-700">Última leitura {tempoRelativo(l.t)} · profundidade total {b.profundidade} cm</p>
          <div className="mt-2"><WaterLevelBar pct={c.pct} status={c.status} /></div>
        </div>
      )}

      <HistoryChart b={b} />
      <SensorSimulator onSimular={onSimular} ocupado={ocupado} />
      <MaintenancePanel manutencoes={b.manutencoes} onRegistrar={onRegistrarManutencao} ocupado={ocupado} />

      <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
        <button type="button" className="btn-ghost" onClick={onEditar}>Editar cadastro</button>
        <button type="button" className="btn-danger" onClick={onExcluir}>Excluir bueiro</button>
      </div>
    </section>
  )
}
