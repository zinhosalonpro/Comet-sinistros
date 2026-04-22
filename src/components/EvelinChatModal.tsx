import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Bot, User, Loader2, MessageSquare, Sparkles } from 'lucide-react'
import type { Sinistro, ChatMessage } from '../types/sinistro'
import { streamEvelinResponse } from '../api/evelin'
import { statusLabel, statusColor } from '../utils/format'

interface Props {
  sinistro: Sinistro
  onClose: () => void
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-comet-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 bg-comet-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-comet-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-comet-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

interface BubbleProps {
  message: ChatMessage
}

function MessageBubble({ message }: BubbleProps) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-gray-300' : 'bg-comet-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-gray-600" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-comet-600 text-white rounded-2xl rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

const WELCOME_MESSAGE = (sinistro: Sinistro): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: `Olá! Sou a **Evelin**, assistente de sinistros da Comet. 😊\n\nEstou aqui para ajudar com o sinistro **${sinistro.numero}** (${statusLabel[sinistro.status]}). O que posso esclarecer para você?`,
  timestamp: new Date(),
})

export function EvelinChatModal({ sinistro, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE(sinistro)])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<boolean>(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent, isStreaming])

  useEffect(() => {
    inputRef.current?.focus()
    return () => { abortRef.current = true }
  }, [])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)
    setStreamingContent('')
    abortRef.current = false

    const history = [...messages, userMsg]
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    try {
      let accumulated = ''
      for await (const chunk of streamEvelinResponse(sinistro, history)) {
        if (abortRef.current) break
        accumulated += chunk
        setStreamingContent(accumulated)
      }

      if (!abortRef.current) {
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: accumulated,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      }
    } catch (err) {
      console.error('Evelin API error:', err)
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
      inputRef.current?.focus()
    }
  }, [input, isStreaming, messages, sinistro])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative pointer-events-auto w-full max-w-md h-[600px] max-h-[85vh] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="bg-comet-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-comet-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-comet-800" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Evelin</p>
            <p className="text-comet-300 text-xs truncate">
              Assistente IA · {sinistro.numero}
            </p>
          </div>

          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[sinistro.status]}`}>
            {statusLabel[sinistro.status]}
          </span>

          <button
            onClick={onClose}
            className="text-comet-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-comet-700"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Context bar */}
        <div className="bg-comet-900/80 px-4 py-2 flex items-center gap-2 flex-shrink-0">
          <MessageSquare className="w-3 h-3 text-comet-400 flex-shrink-0" />
          <p className="text-comet-300 text-xs truncate">
            Contexto: {sinistro.veiculo.marca} {sinistro.veiculo.modelo} ·{' '}
            {sinistro.segurado.nome.split(' ')[0]}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isStreaming && streamingContent && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-comet-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[78%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm">
                {streamingContent}
                <span className="inline-block w-1 h-4 ml-0.5 bg-comet-500 animate-pulse align-text-bottom" />
              </div>
            </div>
          )}

          {isStreaming && !streamingContent && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre este sinistro..."
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-comet-400 focus:ring-1 focus:ring-comet-400 disabled:opacity-50 max-h-28 overflow-y-auto leading-relaxed"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-comet-600 hover:bg-comet-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Enviar"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  )
}
