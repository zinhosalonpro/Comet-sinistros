import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Car,
  User,
  MapPin,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react'
import type { Sinistro } from '../types/sinistro'
import { AgenteDesinistros } from './AgenteDesinistros'
import { EvelinChatModal } from './EvelinChatModal'
import {
  statusLabel,
  statusColor,
  tipoLabel,
  formatDate,
  formatDateTime,
  formatCurrency,
} from '../utils/format'

interface Props {
  sinistro: Sinistro
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-comet-600">{icon}</span>
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </section>
  )
}

export function SinistroDetail({ sinistro }: Props) {
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-comet-800 text-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg hover:bg-comet-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">{sinistro.numero}</p>
            <p className="text-comet-300 text-xs">{tipoLabel[sinistro.tipo]}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[sinistro.status]}`}>
            {statusLabel[sinistro.status]}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Datas e valor */}
        <Section icon={<FileText className="w-4 h-4" />} title="Resumo do Sinistro">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Data de abertura" value={formatDate(sinistro.dataAbertura)} />
            <Field label="Data da ocorrência" value={formatDate(sinistro.dataOcorrencia)} />
            <Field label="Valor estimado" value={formatCurrency(sinistro.valorEstimado)} />
            <Field
              label="Valor aprovado"
              value={sinistro.valorAprovado != null ? formatCurrency(sinistro.valorAprovado) : 'Em análise'}
            />
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1">Local da ocorrência</p>
            <p className="flex items-center gap-1.5 text-sm text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              {sinistro.localOcorrencia}
            </p>
          </div>
          {sinistro.boletimOcorrencia && (
            <p className="mt-2 text-xs text-gray-500">B.O.: {sinistro.boletimOcorrencia}</p>
          )}
        </Section>

        {/* Descrição */}
        <Section icon={<MessageSquare className="w-4 h-4" />} title="Descrição da Ocorrência">
          <p className="text-sm text-gray-700 leading-relaxed">{sinistro.descricao}</p>
          {sinistro.observacoes && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Observações</p>
              <p className="text-sm text-yellow-800">{sinistro.observacoes}</p>
            </div>
          )}
        </Section>

        {/* Segurado */}
        <Section icon={<User className="w-4 h-4" />} title="Segurado">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2">
              <Field label="Nome completo" value={sinistro.segurado.nome} />
            </div>
            <Field label="CPF" value={sinistro.segurado.cpf} />
            <Field label="Telefone" value={sinistro.segurado.telefone} />
          </div>
        </Section>

        {/* Veículo */}
        <Section icon={<Car className="w-4 h-4" />} title="Veículo">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2">
              <Field label="Modelo" value={`${sinistro.veiculo.marca} ${sinistro.veiculo.modelo}`} />
            </div>
            <Field label="Ano" value={String(sinistro.veiculo.ano)} />
            <Field label="Cor" value={sinistro.veiculo.cor} />
            <Field label="Placa" value={sinistro.veiculo.placa} />
            <Field label="RENAVAM" value={sinistro.veiculo.renavam} />
          </div>
        </Section>

        {/* Agente de Sinistros — campo intacto */}
        <AgenteDesinistros agente={sinistro.agenteDesinistros} />

        {/* Valores */}
        <Section icon={<DollarSign className="w-4 h-4" />} title="Valores">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Valor Estimado</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(sinistro.valorEstimado)}</p>
            </div>
            <div className="flex-1 bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Valor Aprovado</p>
              <p className={`text-xl font-bold ${sinistro.valorAprovado != null ? 'text-green-700' : 'text-gray-400'}`}>
                {sinistro.valorAprovado != null ? formatCurrency(sinistro.valorAprovado) : '—'}
              </p>
            </div>
          </div>
        </Section>

        {/* Histórico */}
        <Section icon={<Clock className="w-4 h-4" />} title="Histórico">
          <ol className="relative border-l-2 border-comet-100 pl-5 space-y-4">
            {[...sinistro.historico].reverse().map((item, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[1.4rem] top-1 w-3 h-3 rounded-full bg-comet-400 border-2 border-white" />
                <p className="text-sm text-gray-800">{item.descricao}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDateTime(item.data)} · {item.autor}
                </p>
              </li>
            ))}
          </ol>
        </Section>

      </main>

      {/* Floating button — chat com Evelin */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setChatOpen(true)}
          className="group flex items-center gap-3 bg-comet-600 hover:bg-comet-700 text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-comet-600 group-hover:border-comet-700" />
          </div>
          <span className="text-sm font-semibold">Perguntar à Evelin</span>
        </button>
      </div>

      {chatOpen && (
        <EvelinChatModal sinistro={sinistro} onClose={() => setChatOpen(false)} />
      )}
    </div>
  )
}
