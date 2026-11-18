import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import { STATUS_INFO } from '../lib/classification'

const COR = { normal: '#15803d', atencao: '#d97706', critico: '#dc2626' }

function Enquadrar({ itens, selecionadoId }) {
  const map = useMap()
  useEffect(() => {
    if (itens.length) map.fitBounds(itens.map(({ b }) => [Number(b.lat), Number(b.lng)]), { padding: [40, 40], maxZoom: 15 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itens.length])
  useEffect(() => {
    const s = itens.find(({ b }) => b.id === selecionadoId)
    if (s) map.flyTo([Number(s.b.lat), Number(s.b.lng)], Math.max(map.getZoom(), 15), { duration: 0.6 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionadoId])
  return null
}

const coordValida = ({ b }) => Math.abs(b.lat) <= 90 && Math.abs(b.lng) <= 180

export default function ManholeMap({ itens: todos, selecionadoId, onSelect }) {
  const itens = todos.filter(coordValida)
  return (
    <section className="card overflow-hidden" aria-labelledby="t-mapa">
      <div className="p-4 pb-2">
        <h2 id="t-mapa" className="text-lg font-bold">Mapa dos bueiros</h2>
        <p className="text-sm text-slate-700">Toque em um ponto para ver os detalhes. A lista traz as mesmas informações em texto.</p>
      </div>
      <MapContainer center={[-23.5614, -46.6559]} zoom={13} scrollWheelZoom={false} style={{ height: 380 }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Enquadrar itens={itens} selecionadoId={selecionadoId} />
        {itens.map(({ b, c }) => (
          <CircleMarker
            key={b.id}
            center={[Number(b.lat), Number(b.lng)]}
            radius={b.id === selecionadoId ? 15 : c.status === 'critico' ? 13 : 10}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: COR[c.status], fillOpacity: 1 }}
            eventHandlers={{ click: () => onSelect(b.id) }}
          >
            <Tooltip>{b.nome}: {STATUS_INFO[c.status].label}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 p-3 text-sm">
        {Object.entries(COR).map(([k, cor]) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white ring-1 ring-slate-400" style={{ background: cor }} />
            {STATUS_INFO[k].label}
          </li>
        ))}
      </ul>
    </section>
  )
}
