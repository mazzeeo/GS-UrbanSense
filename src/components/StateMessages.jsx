export function LoadingState() {
  return <p role="status" className="card p-6 text-center font-semibold">Carregando bueiros…</p>
}

export function ErrorBanner({ mensagem, onTentar }) {
  return (
    <div role="alert" className="rounded-xl border-2 border-red-700 bg-red-50 p-3 flex flex-wrap items-center justify-between gap-2">
      <p className="font-semibold text-red-900">{mensagem}</p>
      <button type="button" className="btn-ghost !min-h-[40px] text-sm" onClick={onTentar}>Tentar de novo</button>
    </div>
  )
}

export function EmptyState({ onExemplos, onNovo, ocupado }) {
  return (
    <div className="card p-8 text-center">
      <h2 className="text-xl font-extrabold">Nenhum bueiro cadastrado ainda</h2>
      <p className="mt-2 text-slate-700 max-w-prose mx-auto">Cadastre o primeiro bueiro ou carregue 8 bueiros de exemplo (dados simulados) para ver o painel funcionando.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" className="btn-primary" onClick={onExemplos} disabled={ocupado}>Carregar dados de exemplo</button>
        <button type="button" className="btn-ghost" onClick={onNovo}>Cadastrar bueiro</button>
      </div>
    </div>
  )
}
