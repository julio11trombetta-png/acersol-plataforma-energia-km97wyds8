import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Plus, MessageSquare } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { getAllClients } from '@/services/clients'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/stores/use-auth-store'
import { toast } from 'sonner'

const TYPES = ['Contato', 'Pendência', 'Alteração', 'Reclamação', 'Solicitação']
const STATUSES = ['Aberta', 'Em Andamento', 'Resolvida', 'Fechada']

export default function OcorrenciasPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClient, setFilterClient] = useState('all')
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    clientId: '',
    type: 'Contato',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Aberta',
  })

  const loadData = async () => {
    try {
      const [d, c] = await Promise.all([
        pb.collection('occurrences').getFullList({ sort: '-created', expand: 'clientId' }),
        getAllClients(),
      ])
      setRecords(d)
      setClients(c)
    } catch {
      toast.error('Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('occurrences', () => loadData())

  const filtered =
    filterClient === 'all' ? records : records.filter((r) => r.clientId === filterClient)
  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || '—'

  const handleSubmit = async () => {
    if (!form.clientId || !form.description)
      return toast.error('Associado e descrição são obrigatórios')
    try {
      await pb.collection('occurrences').create({ ...form, userId: user?.id || '' })
      toast.success('Ocorrência registrada!')
      setIsOpen(false)
      setForm({
        clientId: '',
        type: 'Contato',
        description: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'Aberta',
      })
    } catch {
      toast.error('Erro ao registrar')
    }
  }

  const statusCls = (s: string) =>
    s === 'Resolvida' || s === 'Fechada'
      ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20'
      : s === 'Em Andamento'
        ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'
        : 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Ocorrências</h2>
          <p className="text-muted-foreground">Registro de ocorrências dos associados.</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Ocorrência
        </Button>
      </div>
      <Card>
        <CardHeader className="border-b">
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrar por associado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<MessageSquare className="h-10 w-10 text-brand-blue opacity-80" />}
                title="Nenhuma ocorrência"
                description="Registre ocorrências para os associados."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Associado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">
                        {r.expand?.clientId?.name || clientName(r.clientId)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-brand-blue/10 text-brand-blue">
                          {r.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {r.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.date ? new Date(r.date).toLocaleDateString('pt-BR') : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusCls(r.status)}>
                          {r.status}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Ocorrência</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Associado *</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Data</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Descrição *</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
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
