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
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Plus, FileText, Trash2, Download } from 'lucide-react'
import {
  getAssociateDocuments,
  createAssociateDocument,
  deleteAssociateDocument,
} from '@/services/associate-documents'
import { getAllClients } from '@/services/clients'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/stores/use-auth-store'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import pb from '@/lib/pocketbase/client'
import { toast } from 'sonner'

const CATEGORIES = [
  'RG',
  'CPF',
  'CNH',
  'Contrato',
  'Comprovante de Residência',
  'Fatura',
  'Procuração',
  'Outros',
]

export default function DocumentsPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClient, setFilterClient] = useState('all')
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ clientId: '', category: 'RG', file: null as File | null })

  const loadData = async () => {
    try {
      const [d, c] = await Promise.all([getAssociateDocuments(), getAllClients()])
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
  useRealtime('associate_documents', () => loadData())

  const filtered =
    filterClient === 'all' ? records : records.filter((r) => r.clientId === filterClient)
  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || '—'

  const handleSubmit = async () => {
    if (!form.clientId || !form.file) return toast.error('Selecione um associado e um arquivo')
    try {
      const fd = new FormData()
      fd.append('clientId', form.clientId)
      fd.append('category', form.category)
      fd.append('file', form.file)
      fd.append('fileName', form.file.name)
      fd.append('uploadedBy', user?.id || '')
      await createAssociateDocument(fd)
      toast.success('Documento enviado!')
      setIsOpen(false)
      setForm({ clientId: '', category: 'RG', file: null })
    } catch {
      toast.error('Erro ao enviar')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteAssociateDocument(deleteId)
      toast.success('Documento excluído')
    } catch {
      toast.error('Erro')
    } finally {
      setDeleteId(null)
    }
  }

  const fileUrl = (r: any) => (r.file ? pb.files.getUrl(r, r.file) : '#')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Documentos</h2>
          <p className="text-muted-foreground">Central de documentos dos associados.</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Enviar Documento
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
                icon={<FileText className="h-10 w-10 text-brand-blue opacity-80" />}
                title="Nenhum documento"
                description="Envie documentos para os associados."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Associado</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Enviado por</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{clientName(r.clientId)}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-brand-blue/10 text-brand-blue">
                          {r.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.fileName || r.file || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.expand?.uploadedBy?.name || '—'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(r.created).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <a href={fileUrl(r)} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
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
            <DialogTitle>Enviar Documento</DialogTitle>
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
            <div className="space-y-1">
              <Label>Categoria *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Arquivo *</Label>
              <Input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
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
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Documento"
        description="Confirma a exclusão deste documento?"
      />
    </div>
  )
}
