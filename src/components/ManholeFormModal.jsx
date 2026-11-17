import { useEffect, useState } from 'react'

const CAMPOS = [
  ['nome', 'Nome ou código do bueiro', 'text'],
  ['bairro', 'Bairro', 'text'],
  ['endereco', 'Endereço ou referência', 'text'],
  ['lat', 'Latitude (ex.: -23.5614)', 'decimal'],
  ['lng', 'Longitude (ex.: -46.6559)', 'decimal'],
  ['profundidade', 'Profundidade total (cm)', 'decimal'],
]

const num = (v) => Number(String(v).replace(',', '.'))

export default function ManholeFormModal({ inicial, onSalvar, onFechar, salvando }) {
  const [f, setF] = useState(() => ({
    nome: inicial?.nome ?? '', bairro: inicial?.bairro ?? '', endereco: inicial?.endereco ?? '',
    lat: inicial?.lat ?? '', lng: inicial?.lng ?? '', profundidade: inicial?.profundidade ?? 120,
  }))
  const [erros, setErros] = useState({})

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onFechar])

  function validar() {
    const e = {}
    if (!String(f.nome).trim()) e.nome = 'Dê um nome ou código ao bueiro.'
    if (!String(f.bairro).trim()) e.bairro = 'Informe o bairro.'
    if (!String(f.endereco).trim()) e.endereco = 'Informe o endereço ou uma referência.'
    if (String(f.lat) === '' || !(num(f.lat) >= -90 && num(f.lat) <= 90)) e.lat = 'Use um valor entre -90 e 90.'
    if (String(f.lng) === '' || !(num(f.lng) >= -180 && num(f.lng) <= 180)) e.lng = 'Use um valor entre -180 e 180.'
    if (!(num(f.profundidade) > 0)) e.profundidade = 'Informe uma profundidade maior que zero.'
    return e
  }

  async function enviar(ev) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) return
    await onSalvar({
      nome: String(f.nome).trim(), bairro: String(f.bairro).trim(), endereco: String(f.endereco).trim(),
      lat: num(f.lat), lng: num(f.lng), profundidade: num(f.profundidade),
    })
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-ink/60 p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="t-form">
      <form onSubmit={enviar} noValidate className="card w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 space-y-3">
        <h2 id="t-form" className="text-xl font-extrabold">{inicial ? 'Editar bueiro' : 'Cadastrar bueiro'}</h2>
        {CAMPOS.map(([k, rotulo, tipo]) => (
          <div key={k}>
            <label className="label" htmlFor={`f-${k}`}>{rotulo}</label>
            <input
              id={`f-${k}`} className="input" value={f[k]} inputMode={tipo === 'decimal' ? 'decimal' : undefined}
              onChange={(e) => setF({ ...f, [k]: e.target.value })}
              aria-invalid={!!erros[k]} aria-describedby={erros[k] ? `e-${k}` : undefined}
            />
            {erros[k] && <p id={`e-${k}`} className="mt-1 text-sm font-semibold text-red-800">{erros[k]}</p>}
          </div>
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onFechar}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={salvando}>{inicial ? 'Salvar alterações' : 'Cadastrar bueiro'}</button>
        </div>
      </form>
    </div>
  )
}
