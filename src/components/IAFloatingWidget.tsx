import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bot, Send, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { iaChatStream } from '@/services/acersol-ia'
import { cn } from '@/lib/utils'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

export function IAFloatingWidget() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Sou o ACERSOL Expert. Como posso ajudar?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  if (location.pathname === '/dashboard/admin/ia') return null

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
    } catch {
      setMessages((p) => {
        const c = [...p]
        c[c.length - 1] = { role: 'assistant', content: 'Erro ao processar. Tente novamente.' }
        return c
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-blue hover:bg-blue-800 text-white shadow-xl z-50 animate-fade-in"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 text-brand-blue" /> ACERSOL Expert
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                    m.role === 'user' ? 'bg-brand-blue text-white' : 'bg-muted text-foreground',
                  )}
                >
                  {m.content || (loading && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t flex gap-2">
          <Input
            placeholder="Pergunte algo..."
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
