import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (justification: string) => void
  operationLabel: string
}

export function JustificationDialog({ open, onOpenChange, onConfirm, operationLabel }: Props) {
  const [justification, setJustification] = useState('')

  const handleConfirm = () => {
    if (justification.trim().length < 10) return
    onConfirm(justification.trim())
    setJustification('')
  }

  const handleCancel = () => {
    setJustification('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Justificativa Obrigatória
          </DialogTitle>
          <DialogDescription>
            Esta é uma operação crítica (Nível 3). Forneça uma justificativa para prosseguir.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">
              Nível 3 - Crítico
            </Badge>
            <span className="text-sm font-medium">{operationLabel}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa *</Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Descreva o motivo desta alteração (mínimo 10 caracteres)..."
              rows={4}
              autoFocus
            />
            {justification.trim().length > 0 && justification.trim().length < 10 && (
              <p className="text-xs text-orange-500">
                Mínimo 10 caracteres ({justification.trim().length}/10)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={justification.trim().length < 10}
            className="bg-brand-blue text-white"
          >
            Confirmar Operação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
