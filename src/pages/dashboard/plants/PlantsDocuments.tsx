import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  getPlantDocuments,
  createPlantDocument,
  deletePlantDocument,
} from '@/services/plant-documents'
import { getAllPlants } from '@/services/plants'
import { createActivityLog } from '@/services/activity-logs'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/stores/use-auth-store'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import pb from '@/lib/pocketbase/client'
import { toast } from 'sonner'

const CATEGORIES = ['Projeto', 'ART', 'Homologação', 'Licenças', 'Fotos', 'Contratos', 'Outros']

export default function PlantsDocuments() {
  const { user } = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPlant, setFilterPlant] = useState('all')
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ plantId: '', category: 'Projeto', file: null as File | null })

  const loadData = async () => {
    try {
      const [d, p] = await Promise.all([getPlantDocuments(), getAllPlants()])
      setRecords(d)
      setPlants(p)
    } catch {
      toast.error('Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('plant_documents', () => loadData())

  const plantName = (id: string) => plants.find((p) => p.id === id)?.name || '—'
  const filtered =
    filterPlant === 'all' ? records : records.filter((r) => r.plantId === filterPlant)
  const fileUrl = (r: any) => (r.file ? pb.files.getUrl(r, r.file) : '#')

  const handleSubmit = async () => {
    if (!form.plantId || !form.file) return toast.error('Usina e arquivo são obrigatórios')
    try {
      const fd = new FormData()
      fd.append('plantId', form.plantId)
      fd.append('category', form.category)
      fd.append('file', form.file)
      fd.append('fileName', form.file.name)
      fd.append('uploadedBy', user?.id || '')
      await createPlantDocument(fd)
      await createActivityLog({
        action: 'Enviou documento',
        entity: 'plant_documents',
        entityId: form.plantId,
      })
      toast.success('Documento enviado!')
      setIsOpen(false)
      setForm({ plantId: '', category: 'Projeto', file: null })
    } catch {
      toast.error('Erro ao enviar')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePlantDocument(deleteId)
      toast.success('Excluído!')
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
          <h2 className="text-3xl font-bold">Documentos</h2>
          <p className="text-muted-foreground">Central de documentos técnicos das usinas.</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-brand-green hover:bg-green-700 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Enviar Documento
        </Button>
      </div>
      <Card>
        <CardHeader className="border-b">
          <Select value={filterPlant} onValueChange={setFilterPlant}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrar por usina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {plants.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
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
                icon={<FileText className="h-10 w-10 text-brand-green opacity-80" />}
                title="Nenhum documento"
                description="Envie documentos para as usinas."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Usina</TableHead>
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
                      <TableCell className="pl-6 font-medium">{plantName(r.plantId)}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-brand-green/10 text-brand-green">
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
              <Label>Usina *</Label>
              <Select value={form.plantId} onValueChange={(v) => setForm({ ...form, plantId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {plants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
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
                accept="application/pdf,image/jpeg,image/png"
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
              className="bg-brand-green hover:bg-green-700 text-white rounded-full px-8"
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
