import { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import AlertsPanel from './components/AlertsPanel'
import ManholeMap from './components/ManholeMap'
import ManholeList from './components/ManholeList'
import DetailPanel from './components/DetailPanel'
import ManholeFormModal from './components/ManholeFormModal'
import ConfirmDialog from './components/ConfirmDialog'
import { LoadingState, ErrorBanner, EmptyState } from './components/StateMessages'
import { useManholes } from './hooks/useManholes'
import { useFilters } from './hooks/useFilters'
import { useSensorSimulator } from './hooks/useSensorSimulator'
import { modoDemo } from './services/manholeApi'

export default function App() {
  const { items, loading, busy, error, recarregar, criar, atualizar, remover, carregarExemplos } = useManholes()
  const { todos, filtrados, alertas, contagem, busca, setBusca, status, setStatus } = useFilters(items)
  const { simular, aviso: avisoSensor } = useSensorSimulator(atualizar)

  const [selId, setSelId] = useState(null)
  const [form, setForm] = useState(null) // null | { b?: bueiro }
  const [exclusao, setExclusao] = useState(false)
  const [aviso, setAviso] = useState(null)
  const detalheRef = useRef(null)

  const sel = todos.find(({ b }) => b.id === selId) || null

  useEffect(() => {
    if (!aviso) return
    const id = setTimeout(() => setAviso(null), 4000)
    return () => clearTimeout(id)
  }, [aviso])

  function selecionar(id) {
    setSelId(id)
    setTimeout(() => detalheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  async function salvarForm(dados) {
    if (form?.b) {
      const ok = await atualizar(form.b.id, { ...form.b, ...dados })
      if (ok) { setForm(null); setAviso('Cadastro atualizado.') }
    } else {
      const novo = await criar({ ...dados, leituras: [], manutencoes: [] })
      if (novo) { setForm(null); setAviso('Bueiro cadastrado.'); setSelId(novo.id) }
    }
  }

  async function excluir() {
    const ok = await remover(sel.b.id)
    if (ok) { setExclusao(false); setSelId(null); setAviso('Bueiro excluído.') }
  }

  async function registrarManutencao(registro) {
    const ok = await atualizar(sel.b.id, { ...sel.b, manutencoes: [...(sel.b.manutencoes || []), registro] })
    if (ok) setAviso(registro.tipo === 'limpeza' ? 'Limpeza registrada.' : 'Vistoria registrada.')
  }

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-[3000] focus:bg-white focus:p-3">Pular para o conteúdo</a>
      <Header modoDemo={modoDemo} ocupado={busy} onNovo={() => setForm({})} onRecarregar={recarregar} />

      <main id="conteudo" className="mx-auto max-w-7xl px-4 py-5 space-y-4">
        <div aria-live="polite" className="min-h-[1.5rem] text-sm font-semibold text-brand-dark">{aviso || avisoSensor}</div>
        {error && <ErrorBanner mensagem={error} onTentar={recarregar} />}

        {loading ? <LoadingState /> : items.length === 0 ? (
          <EmptyState ocupado={busy} onExemplos={carregarExemplos} onNovo={() => setForm({})} />
        ) : (
          <>
            <SummaryCards contagem={contagem} />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
                <ManholeMap itens={todos} selecionadoId={selId} onSelect={selecionar} />
                <div ref={detalheRef} className="scroll-mt-4">
                  {sel ? (
                    <DetailPanel
                      b={sel.b} c={sel.c} ocupado={busy}
                      onEditar={() => setForm({ b: sel.b })}
                      onExcluir={() => setExclusao(true)}
                      onSimular={(cenario) => simular(sel.b, cenario)}
                      onRegistrarManutencao={registrarManutencao}
                    />
                  ) : (
                    <p className="card p-6 text-center text-slate-700">Escolha um bueiro no mapa ou na lista para ver o histórico e registrar a manutenção.</p>
                  )}
                </div>
              </div>
              <div className="space-y-4 order-1 lg:order-2">
                <AlertsPanel alertas={alertas} onSelect={selecionar} />
                <ManholeList itens={filtrados} selecionadoId={selId} onSelect={selecionar} busca={busca} setBusca={setBusca} status={status} setStatus={setStatus} />
              </div>
            </div>
          </>
        )}
      </main>

      {form && <ManholeFormModal inicial={form.b} salvando={busy} onSalvar={salvarForm} onFechar={() => setForm(null)} />}
      {exclusao && sel && (
        <ConfirmDialog
          titulo="Excluir este bueiro?" confirmar="Excluir bueiro" ocupado={busy}
          texto={`${sel.b.nome} e todo o seu histórico de leituras e manutenções serão apagados. Essa ação não pode ser desfeita.`}
          onConfirmar={excluir} onCancelar={() => setExclusao(false)}
        />
      )}
    </>
  )
}
