export type StatusSinistro = 'aberto' | 'em_analise' | 'concluido' | 'negado' | 'aguardando_docs'

export type TipoSinistro =
  | 'colisao'
  | 'roubo'
  | 'incendio'
  | 'alagamento'
  | 'vidros'
  | 'terceiros'
  | 'outros'

export interface Segurado {
  nome: string
  cpf: string
  telefone: string
  email: string
}

export interface Veiculo {
  placa: string
  modelo: string
  marca: string
  ano: number
  cor: string
  renavam: string
}

export interface AgenteDesinistros {
  nome: string
  matricula: string
  telefone: string
  email: string
  regional: string
}

export interface Sinistro {
  id: string
  numero: string
  dataAbertura: string
  dataOcorrencia: string
  status: StatusSinistro
  tipo: TipoSinistro
  segurado: Segurado
  veiculo: Veiculo
  agenteDesinistros: AgenteDesinistros
  descricao: string
  valorEstimado: number
  valorAprovado?: number
  localOcorrencia: string
  boletimOcorrencia?: string
  observacoes?: string
  historico: HistoricoItem[]
}

export interface HistoricoItem {
  data: string
  descricao: string
  autor: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
