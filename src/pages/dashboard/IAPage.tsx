import { useState, useRef, useEffect, useCallback } from 'react'
import { Bot, Send, Loader2, MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { iaChatStream, iaListChats, iaListMessages } from '@/services/acersol-ia'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}
interface Conv {
  id: string
  title?: string
  updated?: string
}

export default function IAPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou o ACERSOL Expert. Posso ajudar com dados de associados, usinas, faturamento e leads. O que você precisa?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conv[]>([])
  const [loadingConvs, setLoadingConvs] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const loadConvs = useCallback(async () => {
    try {
      const data = await iaListChats(20)
      setConversations(data.conversations || [])
    } catch {
      setConversations([])
    } finally {
      setLoadingConvs(false)
    }
  }, [])

  useEffect(() => {
    loadConvs()
  }, [loadConvs])
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  const loadConv = async (id: string) => {
    try {
      const msgs = await iaListMessages(id)
      setConvId(id)
      setMessages(
        msgs.length > 0
          ? msgs.map((m: any) => ({ role: m.role, content: m.content }))
          : [{ role: 'assistant', content: 'Conversa vazia.' }],
      )
    } catch {
      /* ignore */
    }
  }

  const newChat = () => {
    setConvId(null)
    setMessages([{ role: 'assistant', content: 'Nova conversa iniciada. Como posso ajudar?' }])
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setInput('')
    setMessages((p) => [...p, { role: 'user', content: msg }, { role: 'assistant', content: '' }])
    setLoading(true)
    try {
      const controller = new AbortController()
      const result = await iaChatStream(msg, convId, controller.signal, (_d, full) => {
        setMessages((p) => {
          const c = [...p]
          c[c.length - 1] = { role: 'assistant', content: full }
          return c
        })
      })
      setConvId(result.conversationId)
      loadConvs()
    } catch {
      setMessages((p) => {
        const c = [...p]
        c[c.length - 1] = { role: 'assistant', content: 'Erro ao processar.' }
        return c
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 animate-fade-in h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">ACERSOL Expert IA</h2>
            <p className="text-sm text-muted-foreground">
              Assistente inteligente para gestão energética
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={newChat} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Nova Conversa
        </Button>
      </div>
      <div className="flex gap-4 h-full">
        <Card className="hidden md:flex w-64 flex-col p-2 overflow-hidden">
          <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
            Conversas
          </p>
          <ScrollArea className="flex-1">
            {loadingConvs ? (
              <div className="p-2 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-muted/40 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground">Nenhuma conversa ainda.</p>
            ) : (
              <div className="space-y-1">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => loadConv(c.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors text-left',
                      convId === c.id && 'bg-muted',
                    )}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{c.title || 'Conversa'}</span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
        <Card className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                      m.role === 'user'
                        ? 'bg-brand-blue text-white rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md',
                    )}
                  >
                    {m.content || (loading && i === messages.length - 1 ? '...' : '')}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-3 border-t flex gap-2 max-w-3xl mx-auto w-full">
            <Input
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              disabled={loading}
            />
            <Button
              size="icon"
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-brand-blue hover:bg-blue-800 text-white shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
