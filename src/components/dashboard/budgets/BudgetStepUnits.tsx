import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Copy, Trash2, Zap } from 'lucide-react'
import { UnitModal } from './UnitModal'

interface Props {
  units: any[]
  setUnits: (units: any[]) => void
}

export function BudgetStepUnits({ units, setUnits }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)

  const handleSave = (data: any) => {
    if (editingIdx !== null) {
      const updated = [...units]
      updated[editingIdx] = { ...updated[editingIdx], ...data }
      setUnits(updated)
    } else {
      setUnits([...units, { ...data, _tempId: `temp_${Date.now()}` }])
    }
  }

  const handleEdit = (idx: number) => {
    setEditingIdx(idx)
    setModalOpen(true)
  }

  const handleDuplicate = (idx: number) => {
    setUnits([...units, { ...units[idx], _tempId: `temp_${Date.now()}`, numero_uc: '' }])
  }

  const handleDelete = (idx: number) => {
    setUnits(units.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Unidades Consumidoras</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie múltiplas UCs para este orçamento.
          </p>
        </div>
        <Button
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
          onClick={() => {
            setEditingIdx(null)
            setModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar UC
        </Button>
      </div>
      {units.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhuma UC adicionada. Clique em "Adicionar UC".
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Nº UC</TableHead>
                <TableHead>Distribuidora</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((u, i) => (
                <TableRow key={i} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-medium">{u.numero_uc}</TableCell>
                  <TableCell className="text-muted-foreground">{u.distribuidora || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.cidade || '—'}/{u.estado || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.classe || '—'}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${u.status === 'Ativa' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                    >
                      {u.status || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(i)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDuplicate(i)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(i)}
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
      <UnitModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editingIdx !== null ? units[editingIdx] : undefined}
        onSave={handleSave}
      />
    </div>
  )
}
