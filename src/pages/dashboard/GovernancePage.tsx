import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Gavel, Calendar, MapPin } from 'lucide-react'
import { getAssemblies, createAssembly } from '@/services/governance'
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
import { toast } from 'sonner'
import { exportToExcel, exportToPDF } from '@/lib/export-utils'
import { FileDown } from 'lucide-react'

export default function GovernancePage() {
  const [assemblies, setAssemblies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    date: '',
    status: 'Agendada',
    location: '',
    description: '',
  })

  const loadData = async () => {
    try {
      setAssemblies(await getAssemblies())
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('assemblies', () => loadData())

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Título obrigatório')
      return
    }
    try {
      await createAssembly(form)
      toast.success('Assembleia criada!')
      setIsOpen(false)
      setForm({ title: '', date: '', status: 'Agendada', location: '', description: '' })
    } catch {
      toast.error('Erro ao criar assembleia')
    }
  }

  const statusCls = (s: string) =>
    s === 'Realizada'
      ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20'
      : s === 'Cancelada'
        ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20'
        : 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <Gavel className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Governança</h2>
            <p className="text-sm text-muted-foreground">Assembleias e documentos legais</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() =>
              exportToExcel(
                'assembleias',
                ['Título', 'Data', 'Status', 'Local'],
                assemblies.map((a) => [a.title, a.date || '', a.status || '', a.location || '']),
              )
            }
          >
            <FileDown className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Assembleia
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : assemblies.length === 0 ? (
        <EmptyState
          icon={<Gavel className="h-10 w-10 text-brand-blue" />}
          title="Nenhuma assembleia"
          description="Agende a primeira assembleia da associação."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assemblies.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm">{a.title}</h3>
                  <Badge variant="outline" className={statusCls(a.status)}>
                    {a.status}
                  </Badge>
                </div>
                {a.date && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(a.date).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {a.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {a.location}
                  </p>
                )}
                {a.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Assembleia</DialogTitle>
            <DialogDescription>Agende uma assembleia da associação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agendada">Agendada</SelectItem>
                    <SelectItem value="Realizada">Realizada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Local</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
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
