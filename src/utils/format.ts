export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const statusLabel: Record<string, string> = {
  aberto: 'Aberto',
  em_analise: 'Em Análise',
  concluido: 'Concluído',
  negado: 'Negado',
  aguardando_docs: 'Aguardando Docs',
}

export const statusColor: Record<string, string> = {
  aberto: 'bg-blue-100 text-blue-700',
  em_analise: 'bg-yellow-100 text-yellow-700',
  concluido: 'bg-green-100 text-green-700',
  negado: 'bg-red-100 text-red-700',
  aguardando_docs: 'bg-orange-100 text-orange-700',
}

export const tipoLabel: Record<string, string> = {
  colisao: 'Colisão',
  roubo: 'Roubo/Furto',
  incendio: 'Incêndio',
  alagamento: 'Alagamento',
  vidros: 'Vidros',
  terceiros: 'Danos a Terceiros',
  outros: 'Outros',
}
