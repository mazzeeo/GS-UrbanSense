const ITENS = [
  { k: 'critico', rotulo: 'Críticos', cls: 'border-red-700 bg-red-50' },
  { k: 'atencao', rotulo: 'Em atenção', cls: 'border-amber-700 bg-amber-50' },
  { k: 'normal', rotulo: 'Normais', cls: 'border-green-700 bg-green-50' },
  { k: 'total', rotulo: 'Monitorados', cls: 'border-slate-400 bg-white' },
]

export default function SummaryCards({ contagem }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="Resumo da situação">
      {ITENS.map(({ k, rotulo, cls }) => (
        <li key={k} className={`rounded-2xl border-2 px-4 py-3 ${cls}`}>
          <p className="font-display text-4xl font-extrabold leading-none">{contagem[k]}</p>
          <p className="mt-1 text-sm font-semibold">{rotulo}</p>
        </li>
      ))}
    </ul>
  )
}
