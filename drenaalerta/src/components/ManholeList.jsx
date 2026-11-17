import ManholeCard from './ManholeCard'

const FILTROS = [['todos', 'Todos'], ['critico', 'Críticos'], ['atencao', 'Atenção'], ['normal', 'Normais']]

export default function ManholeList({ itens, selecionadoId, onSelect, busca, setBusca, status, setStatus }) {
  return (
    <section className="card p-4" aria-labelledby="t-lista">
      <h2 id="t-lista" className="text-lg font-bold">Bueiros</h2>
      <label className="label mt-3" htmlFor="busca">Buscar por nome, bairro ou endereço</label>
      <input id="busca" className="input" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: Paulista" />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por situação">
        {FILTROS.map(([k, rotulo]) => (
          <button
            key={k} type="button" aria-pressed={status === k} onClick={() => setStatus(k)}
            className={`rounded-full border-2 px-3 py-1 text-sm font-semibold min-h-[36px] ${status === k ? 'bg-ink text-white border-ink' : 'bg-white border-slate-400 hover:bg-slate-100'}`}
          >
            {rotulo}
          </button>
        ))}
      </div>
      {itens.length === 0 ? (
        <p className="mt-4 text-slate-700">Nenhum bueiro encontrado com esses filtros.</p>
      ) : (
        <ul className="mt-4 space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {itens.map(({ b, c }) => (
            <ManholeCard key={b.id} b={b} c={c} selecionado={b.id === selecionadoId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </section>
  )
}
