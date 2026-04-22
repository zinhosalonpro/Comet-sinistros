import { useNavigate } from 'react-router-dom'
import { FileText, ChevronRight, Car, Calendar } from 'lucide-react'
import type { Sinistro } from '../types/sinistro'
import { statusLabel, statusColor, tipoLabel, formatDate, formatCurrency } from '../utils/format'

interface Props {
  sinistros: Sinistro[]
}

export function SinistrosList({ sinistros }: Props) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-comet-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <FileText className="w-6 h-6" />
          <h1 className="text-xl font-semibold tracking-tight">Comet Sinistros</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sinistros</h2>
            <p className="text-sm text-gray-500 mt-1">{sinistros.length} registros encontrados</p>
          </div>
        </div>

        <div className="space-y-3">
          {sinistros.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/sinistro/${s.id}`)}
              className="w-full bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:border-comet-400 hover:shadow-md transition-all text-left group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-comet-100 flex items-center justify-center">
                <Car className="w-5 h-5 text-comet-700" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 text-sm">{s.numero}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {tipoLabel[s.tipo]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{s.segurado.nome}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(s.dataAbertura)}
                  </span>
                  <span className="text-xs text-gray-400">{s.veiculo.marca} {s.veiculo.modelo} · {s.veiculo.placa}</span>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-700">{formatCurrency(s.valorEstimado)}</p>
                <p className="text-xs text-gray-400 mt-0.5">estimado</p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-comet-500 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
