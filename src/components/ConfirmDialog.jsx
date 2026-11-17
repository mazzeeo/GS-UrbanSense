import { useEffect } from 'react'

export default function ConfirmDialog({ titulo, texto, confirmar, onConfirmar, onCancelar, ocupado }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onCancelar()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onCancelar])

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink/60 p-4" role="alertdialog" aria-modal="true" aria-labelledby="t-conf">
      <div className="card w-full max-w-md p-5">
        <h2 id="t-conf" className="text-xl font-extrabold">{titulo}</h2>
        <p className="mt-2">{texto}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="btn-danger" onClick={onConfirmar} disabled={ocupado}>{confirmar}</button>
        </div>
      </div>
    </div>
  )
}
