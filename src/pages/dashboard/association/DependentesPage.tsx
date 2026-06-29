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
import { Plus, Users, Edit, Trash2 } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { getAllClients } from '@/services/clients'
import { useRealtime } from '@/hooks/use-realtime'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import { toast } from 'sonner'

const RELATIONSHIPS = ['Cônjuge', 'Filho(a)', 'Pai/Mãe', 'Irmão(ã)', 'Outro']

export default function DependentesPage() {
  const [records, setRecords] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClient, setFilterClient] = useState('all')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    clientId: '',
    name: '',
    relationship: 'Cônjuge',
    phone: '',
    email: '',
    birthDate: '',
  })

  const loadData = async () => {
    try {
      const [d, c] = await Promise.all([
        pb.collection('dependents').getFullList({ sort: '-created' }),
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
  useRealtime('dependents', () => loadData())

  const filtered =
    filterClient === 'all' ? records : records.filter((r) => r.clientId === filterClient)
  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || '—'

  const openDialog = (r?: any) => {
    if (r) {
      setEditing(r)
      setForm({
        clientId: r.clientId,
        name: r.name,
        relationship: r.relationship || 'Cônjuge',
        phone: r.phone || '',
        email: r.email || '',
        birthDate: r.birthDate || '',
      })
    } else {
      setEditing(null)
      setForm({
        clientId: '',
        name: '',
        relationship: 'Cônjuge',
        phone: '',
        email: '',
        birthDate: '',
      })
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.clientId || !form.name) return toast.error('Associado e nome são obrigatórios')
    try {
      if (editing) {
        await pb.collection('dependents').update(editing.id, form)
        toast.success('Dependente atualizado!')
      } else {
        await pb.collection('dependents').create(form)
        toast.success('Dependente criado!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await pb.collection('dependents').delete(deleteId)
      toast.success('Dependente excluído')
    } catch {
      toast.error('Erro')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dependentes</h2>
          <p className="text-muted-foreground">Gestão de dependentes dos associados.</p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Dependente
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
                icon={<Users className="h-10 w-10 text-brand-blue opacity-80" />}
                title="Nenhum dependente"
                description="Cadastre dependentes para os associados."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Associado</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Parentesco</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Nascimento</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{clientName(r.clientId)}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-brand-blue/10 text-brand-blue">
                          {r.relationship || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.phone || r.email || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.birthDate ? new Date(r.birthDate).toLocaleDateString('pt-BR') : '—'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(r)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
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
            <DialogTitle>{editing ? 'Editar Dependente' : 'Novo Dependente'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
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
            <div className="col-span-2 space-y-1">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Parentesco</Label>
              <Select
                value={form.relationship}
                onValueChange={(v) => setForm({ ...form, relationship: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Nascimento</Label>
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8"
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Dependente"
        description="Confirma a exclusão deste dependente?"
      />
    </div>
  )
}
