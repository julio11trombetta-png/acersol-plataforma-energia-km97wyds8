import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, Check, QrCode, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatters'

interface PixPaymentDialogProps {
  invoice: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PixPaymentDialog({ invoice, open, onOpenChange }: PixPaymentDialogProps) {
  const [copied, setCopied] = useState(false)

  const client = invoice?.expand?.clientId
  const amount = Number(invoice?.amount || 0)
  const discount = Number(client?.discount_percentage) || 0
  const finalAmount = amount - (amount * discount) / 100

  const pixCode = `00020126360014BR.GOV.BCB.PIX0114+5511400000000520ACERSOL6009SAO PAULO62070503***6304${invoice?.id?.slice(0, 4).toUpperCase() || 'ACER'}`

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    toast.success('Código PIX copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-brand-green" />
            Pagamento via PIX
          </DialogTitle>
          <DialogDescription>
            Fatura {invoice.month} - {client?.name || 'Cliente'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4 py-4 bg-muted/30 rounded-xl">
            <div className="relative">
              <div className="w-44 h-44 bg-white rounded-xl border-4 border-brand-green/20 flex items-center justify-center shadow-md">
                <div className="grid grid-cols-8 gap-0.5 w-32 h-32">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const seed = (invoice.id?.charCodeAt(i % invoice.id.length) || 65) + i
                    return (
                      <div
                        key={i}
                        className={
                          seed % 3 === 0 || seed % 5 === 0
                            ? 'bg-foreground rounded-sm'
                            : 'bg-transparent'
                        }
                      />
                    )
                  })}
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-brand-green text-white rounded-full p-1.5 shadow-lg">
                <QrCode className="h-4 w-4" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-green">{formatCurrency(finalAmount)}</p>
              {discount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Desconto de {discount}% aplicado
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Código PIX (Copia e Cola)</p>
            <div className="relative">
              <div className="bg-muted/50 rounded-lg p-3 pr-12 border">
                <p className="text-xs font-mono text-muted-foreground break-all line-clamp-3">
                  {pixCode}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-brand-green" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            <Clock className="h-4 w-4 text-brand-yellow shrink-0" />
            <span>
              {invoice.due_date
                ? `Vence em ${new Date(invoice.due_date).toLocaleDateString('pt-BR')}. `
                : ''}
              O pagamento é processado automaticamente após a confirmação do PIX.
            </span>
          </div>

          <Button
            className="w-full rounded-full bg-brand-green hover:bg-green-700 text-white shadow-md"
            onClick={() => {
              handleCopy()
              onOpenChange(false)
            }}
          >
            Copiar e Pagar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
