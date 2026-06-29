import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, LifeBuoy, Search } from 'lucide-react'
import { getTickets, createTicket } from '@/services/support'
import { getAllClients } from '@/services/clients'
import { useRealtime } from '@/hooks/use-realtime'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    subject: '',
    description: '',
    status: 'Aberto',
    priority: 'Media',
    clientId: '',
  })

  const loadData = async () => {
    try {
      const [t, c] = await Promise.all([getTickets(), getAllClients()])
      setTickets(t)
      setClients(c)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('tickets', () => loadData())

  const filtered = tickets.filter((t) => t.subject?.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async () => {
    if (!form.subject.trim()) {
      toast.error('Assunto obrigatório')
      return
    }
    try {
      await createTicket(form)
      toast.success('Chamado criado!')
      setIsOpen(false)
      setForm({ subject: '', description: '', status: 'Aberto', priority: 'Media', clientId: '' })
    } catch {
      toast.error('Erro ao criar chamado')
    }
  }

  const statusCls = (s: string) =>
    s === 'Fechado' || s === 'Resolvido'
      ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20'
      : s === 'Em Andamento'
        ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'
        : 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20'
  const prioCls = (p: string) =>
    p === 'Urgente'
      ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20'
      : p === 'Alta'
        ? 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20'
        : 'text-muted-foreground bg-muted/30'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <LifeBuoy className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Suporte</h2>
            <p className="text-sm text-muted-foreground">Gestão de chamados e atendimentos</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Chamado
        </Button>
      </div>
      <Card className="border-muted shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/10">
          <div className="flex justify-between items-center">
            <CardTitle>Chamados</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar chamados..."
                className="pl-9 rounded-full bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted/40 rounded-md animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<LifeBuoy className="h-10 w-10 text-brand-blue" />}
                title="Nenhum chamado"
                description="Não há chamados registrados."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Assunto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{t.subject}</TableCell>
                      <TableCell>{t.expand?.clientId?.name || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={prioCls(t.priority)}>
                          {t.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusCls(t.status)}>
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Chamado</DialogTitle>
            <DialogDescription>Registre um novo chamado de suporte.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assunto</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => setForm({ ...form, clientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Media">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" className="rounded-full" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
