import StatusBadge from './StatusBadge'

export default function AlertsPanel({ alertas, onSelect }) {
  return (
    <section className="card p-4" aria-labelledby="t-alertas">
      <h2 id="t-alertas" className="text-lg font-bold">Precisam de inspeção</h2>
      {alertas.length === 0 ? (
        <p className="mt-2 text-slate-700">Nenhum bueiro precisa de inspeção agora.</p>
      ) : (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {alertas.map(({ b, c }) => (
            <li key={b.id} className={`rounded-xl border-l-8 p-3 ${c.status === 'critico' ? 'border-red-700 bg-red-50' : 'border-amber-600 bg-amber-50'}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold leading-snug">{b.nome}</p>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-1 text-sm">{c.motivos[0]}</p>
              <button type="button" className="btn-ghost mt-2 !min-h-[40px] text-sm" onClick={() => onSelect(b.id)}>
                Ver detalhes e registrar vistoria
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
