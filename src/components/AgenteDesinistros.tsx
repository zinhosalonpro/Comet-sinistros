import { UserCheck, Phone, Mail, MapPin, BadgeCheck } from 'lucide-react'
import type { AgenteDesinistros as AgenteType } from '../types/sinistro'

interface Props {
  agente: AgenteType
}

export function AgenteDesinistros({ agente }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-4 h-4 text-comet-600" />
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Agente de Sinistros
        </h3>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-comet-100 flex items-center justify-center flex-shrink-0">
          <span className="text-comet-700 font-bold text-base">
            {agente.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800">{agente.nome}</p>
            <span className="flex items-center gap-1 text-xs text-comet-600 bg-comet-50 px-2 py-0.5 rounded-full">
              <BadgeCheck className="w-3 h-3" />
              {agente.matricula}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <a
              href={`tel:${agente.telefone}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-comet-600 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {agente.telefone}
            </a>
            <a
              href={`mailto:${agente.email}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-comet-600 transition-colors truncate"
            >
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              {agente.email}
            </a>
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Regional {agente.regional}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
