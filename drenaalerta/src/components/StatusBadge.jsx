import { STATUS_INFO } from '../lib/classification'

const ESTILOS = {
  normal: 'bg-green-100 text-green-900 border-green-700',
  atencao: 'bg-amber-100 text-amber-900 border-amber-700',
  critico: 'bg-red-100 text-red-900 border-red-700',
}

// Cor + ícone + texto: o estado nunca depende só da cor.
export default function StatusBadge({ status, grande = false }) {
  const info = STATUS_INFO[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-0.5 font-bold whitespace-nowrap ${grande ? 'text-base' : 'text-sm'} ${ESTILOS[status]}`}>
      <span aria-hidden="true">{info.icon}</span>
      {info.label}
    </span>
  )
}
