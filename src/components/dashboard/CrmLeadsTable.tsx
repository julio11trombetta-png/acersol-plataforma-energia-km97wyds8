import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2, Building, FileDown } from 'lucide-react'
import { getCrmLeads, createCrmLead, updateCrmLead, deleteCrmLead } from '@/services/crm'
import { useRealtime } from '@/hooks/use-realtime'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { exportToExcel } from '@/lib/export-utils'
import { formatDocument } from '@/lib/formatters'

const statusColors: Record<string, string> = {
  'Novos Leads': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Em Contato': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Proposta: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Assinado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export function CrmLeadsTable() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ company: '', cnpj: '', type: '', status: 'Novos Leads' })

  const loadData = async () => {
    try {
      setLeads(await getCrmLeads())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('crm_leads', () => loadData())

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search || l.company?.toLowerCase().includes(search.toLowerCase()) || l.cnpj?.includes(search)
    const matchStatus = !fStatus || l.status === fStatus
    return matchSearch && matchStatus
  })

  const openDialog = (lead?: any) => {
    if (lead) {
      setEditing(lead)
      setForm({
        company: lead.company,
        cnpj: lead.cnpj || '',
        type: lead.type || '',
        status: lead.status || 'Novos Leads',
      })
    } else {
      setEditing(null)
      setForm({ company: '', cnpj: '', type: '', status: 'Novos Leads' })
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.company.trim()) {
      toast.error('Empresa obrigatória')
      return
    }
    try {
      if (editing) {
        await updateCrmLead(editing.id, form)
        toast.success('Lead atualizado!')
      } else {
        await createCrmLead(form)
        toast.success('Lead criado!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCrmLead(id)
      toast.info('Lead removido')
    } catch {
      toast.error('Erro')
    }
  }

  const handleExport = () => {
    exportToExcel(
      'leads',
      ['Empresa', 'CNPJ', 'Tipo', 'Status'],
      filtered.map((l) => [l.company, l.cnpj || '', l.type || '', l.status || '']),
    )
  }

  return (
    <Card className="border-muted shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa..."
                className="pl-9 rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={fStatus || 'all'}
              onValueChange={(v) => setFStatus(v === 'all' ? '' : v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Novos Leads">Novos Leads</SelectItem>
                <SelectItem value="Em Contato">Em Contato</SelectItem>
                <SelectItem value="Proposta">Proposta</SelectItem>
                <SelectItem value="Assinado">Assinado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" /> Exportar
            </Button>
            <Button
              onClick={() => openDialog()}
              className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Lead
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted/40 rounded-md animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Building className="h-10 w-10 text-brand-blue opacity-80" />}
            title="Nenhum lead"
            description="Cadastre o primeiro lead no CRM."
            action={
              <Button
                onClick={() => openDialog()}
                className="mt-4 rounded-full bg-brand-blue hover:bg-blue-800 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Novo Lead
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Empresa</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-medium">{l.company}</TableCell>
                    <TableCell className="text-muted-foreground">{l.cnpj || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {l.type || 'Geral'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[l.status] || ''}>
                        {l.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(l)}
                          className="hover:bg-brand-blue/10 hover:text-brand-blue"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(l.id)}
                          className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
            <DialogDescription>Cadastre os dados do lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input
                placeholder="Ex: Empresa Ltda"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                placeholder="00.000.000/0001-00"
                value={form.cnpj}
                onChange={(e) => setForm({ ...form, cnpj: formatDocument(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input
                  placeholder="Ex: Comercial"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Novos Leads">Novos Leads</SelectItem>
                    <SelectItem value="Em Contato">Em Contato</SelectItem>
                    <SelectItem value="Proposta">Proposta</SelectItem>
                    <SelectItem value="Assinado">Assinado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
    </Card>
  )
}
