import { CENARIOS } from '../lib/simulation'

export default function SensorSimulator({ onSimular, ocupado }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-400 p-3">
      <h3 className="font-bold">Simulador de sensor</h3>
      <p className="text-sm text-slate-700">Na demonstração, estes botões fazem o papel do ESP32 enviando uma nova leitura.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(CENARIOS).map(([k, { rotulo, ajuda }]) => (
          <button key={k} type="button" title={ajuda} className="btn-ghost !min-h-[40px] text-sm" disabled={ocupado} onClick={() => onSimular(k)}>
            {rotulo}
          </button>
        ))}
      </div>
    </div>
  )
}
