import OpenAI from 'openai'
import type { Sinistro } from '../types/sinistro'
import { tipoLabel, statusLabel, formatDate, formatCurrency } from '../utils/format'

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

function buildSystemPrompt(sinistro: Sinistro): string {
  return `Você é a Evelin, assistente virtual especializada em sinistros da Comet Seguros.
Você está atendendo no contexto EXCLUSIVO do sinistro abaixo. Responda sempre sobre este sinistro específico.
Seja objetiva, empática e profissional. Use linguagem clara em português brasileiro.
Não invente informações que não constam no sinistro — se não souber algo, diga que vai verificar com o agente responsável.

═══════════════════════════════════
DADOS DO SINISTRO ATIVO
═══════════════════════════════════
Número: ${sinistro.numero}
Status atual: ${statusLabel[sinistro.status]}
Tipo: ${tipoLabel[sinistro.tipo]}
Data de abertura: ${formatDate(sinistro.dataAbertura)}
Data da ocorrência: ${formatDate(sinistro.dataOcorrencia)}
Local: ${sinistro.localOcorrencia}
${sinistro.boletimOcorrencia ? `B.O.: ${sinistro.boletimOcorrencia}` : ''}

SEGURADO
  Nome: ${sinistro.segurado.nome}
  CPF: ${sinistro.segurado.cpf}
  Telefone: ${sinistro.segurado.telefone}
  E-mail: ${sinistro.segurado.email}

VEÍCULO
  ${sinistro.veiculo.marca} ${sinistro.veiculo.modelo} ${sinistro.veiculo.ano}
  Placa: ${sinistro.veiculo.placa} · Cor: ${sinistro.veiculo.cor}
  RENAVAM: ${sinistro.veiculo.renavam}

DESCRIÇÃO DO OCORRIDO
  ${sinistro.descricao}

VALORES
  Estimado: ${formatCurrency(sinistro.valorEstimado)}
  ${sinistro.valorAprovado != null ? `Aprovado: ${formatCurrency(sinistro.valorAprovado)}` : 'Aprovado: em análise'}

AGENTE RESPONSÁVEL
  ${sinistro.agenteDesinistros.nome} (${sinistro.agenteDesinistros.matricula})
  ${sinistro.agenteDesinistros.telefone} · ${sinistro.agenteDesinistros.email}

HISTÓRICO
${sinistro.historico.map((h) => `  • ${h.data.slice(0, 10)} — ${h.descricao} [${h.autor}]`).join('\n')}
${sinistro.observacoes ? `\nOBSERVAÇÕES\n  ${sinistro.observacoes}` : ''}
═══════════════════════════════════`
}

export interface EvelinMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function* streamEvelinResponse(
  sinistro: Sinistro,
  messages: EvelinMessage[],
): AsyncGenerator<string> {
  const stream = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: 'system', content: buildSystemPrompt(sinistro) },
      ...messages,
    ],
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content
    if (text) yield text
  }
}
