export default function Header({ modoDemo, onNovo, onRecarregar, ocupado }) {
  return (
    <header className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <svg aria-hidden="true" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
            <path d="M9 14h6M10 17h4" />
          </svg>
          <div>
<<<<<<< HEAD
            <h1 className="text-2xl font-extrabold leading-tight">UrbanSense</h1>
=======
            <h1 className="text-2xl font-extrabold leading-tight">DrenaAlerta</h1>
>>>>>>> bfba7e9 (Fazendo a API)
            <p className="text-sm text-sky-200">Veja o bueiro entupindo antes da água subir na rua</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn bg-transparent border-white/50 text-white hover:bg-white/15" onClick={onRecarregar} disabled={ocupado}>
            Atualizar dados
          </button>
          <button type="button" className="btn bg-white text-ink border-white hover:bg-sky-100" onClick={onNovo}>
            Cadastrar bueiro
          </button>
        </div>
      </div>
      {modoDemo && (
        <p className="bg-amber-100 text-amber-950 text-sm px-4 py-2 text-center">
          Modo demonstração: os dados ficam só neste navegador. Para usar a API externa, defina <code className="font-bold">VITE_API_URL</code> (veja o README).
        </p>
      )}
    </header>
  )
}
