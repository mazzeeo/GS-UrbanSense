import { useState } from 'react'
import { fmtDataHora } from '../lib/format'

const TIPOS = { vistoria: 'Vistoriado', limpeza: 'Limpo' }

export default function MaintenancePanel({ manutencoes = [], onRegistrar, ocupado }) {
  const [tipo, setTipo] = useState('vistoria')
  const [responsavel, setResponsavel] = useState('')
  const [obs, setObs] = useState('')
  const [erro, setErro] = useState('')

  async function enviar(e) {
    e.preventDefault()
    if (!responsavel.trim()) return setErro('Informe quem fez o serviço.')
    setErro('')
    await onRegistrar({ data: new Date().toISOString(), tipo, responsavel: responsavel.trim(), obs: obs.trim() })
    setObs('')
  }

  return (
    <div>
      <h3 className="font-bold">Registro de manutenção</h3>
      <form onSubmit={enviar} className="mt-2 grid gap-3 sm:grid-cols-2" noValidate>
        <div>
          <label className="label" htmlFor="m-tipo">O que foi feito</label>
          <select id="m-tipo" className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="vistoria">Vistoriei o bueiro</option>
            <option value="limpeza">Limpei o bueiro</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="m-resp">Responsável</label>
          <input id="m-resp" className="input" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} aria-invalid={!!erro} aria-describedby={erro ? 'm-erro' : undefined} />
          {erro && <p id="m-erro" className="mt-1 text-sm font-semibold text-red-800">{erro}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="m-obs">Observações (opcional)</label>
          <input id="m-obs" className="input" value={obs} onChange={(e) => setObs(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={ocupado}>Salvar registro</button>
        </div>
      </form>
      {manutencoes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {[...manutencoes].reverse().map((m, i) => (
            <li key={m.data + i} className="rounded-xl bg-slate-100 p-3 text-sm">
              <p className="font-bold">{TIPOS[m.tipo]} · {fmtDataHora(m.data)}</p>
              <p>{m.responsavel}{m.obs ? `: ${m.obs}` : ''}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
