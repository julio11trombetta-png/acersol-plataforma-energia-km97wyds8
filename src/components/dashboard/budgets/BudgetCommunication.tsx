import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Mail, Link2, Copy } from 'lucide-react'
import { createBudgetMessage, logBudgetAction } from '@/services/budgets'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  budget: any
}

export function BudgetCommunication({ open, onOpenChange, budget }: Props) {
  const [message, setMessage] = useState('')
  const client = budget?.expand?.client_id || budget?.expand?.lead_id
  const phone = client?.phone || client?.whatsapp || ''
  const email = client?.email || ''
  const publicLink = `${window.location.origin}/dashboard/admin/comercial/orcamentos/${budget?.id || ''}`

  const sendWhatsApp = async () => {
    if (!phone) return toast.error('Telefone não disponível')
    const text = encodeURIComponent(message || `Proposta ${budget?.numero} - ACERSOL Energia Solar`)
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${text}`, '_blank')
    await createBudgetMessage({
      budget_id: budget.id,
      channel: 'WhatsApp',
      recipient: phone,
      content: message,
      status: 'Enviado',
    })
    await logBudgetAction(budget.id, 'Envio WhatsApp', `Enviado para ${phone}`)
    toast.success('Aberto no WhatsApp')
    onOpenChange(false)
  }

  const sendEmail = async () => {
    if (!email) return toast.error('E-mail não disponível')
    const subject = `Proposta ACERSOL - ${budget?.numero || ''}`
    window.open(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
    )
    await createBudgetMessage({
      budget_id: budget.id,
      channel: 'Email',
      recipient: email,
      content: message,
      status: 'Enviado',
    })
    await logBudgetAction(budget.id, 'Envio Email', `Enviado para ${email}`)
    toast.success('Aberto no cliente de e-mail')
    onOpenChange(false)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicLink)
    await createBudgetMessage({
      budget_id: budget.id,
      channel: 'Link',
      recipient: 'Público',
      content: publicLink,
      status: 'Enviado',
    })
    await logBudgetAction(budget.id, 'Link Copiado', 'Link público copiado')
    toast.success('Link copiado!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
          <DialogDescription>
            Escolha o canal de envio da proposta {budget?.numero}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            rows={3}
            placeholder="Mensagem personalizada (opcional)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              className="justify-start rounded-full"
              onClick={sendWhatsApp}
              disabled={!phone}
            >
              <MessageCircle className="mr-2 h-4 w-4 text-green-600" /> WhatsApp{' '}
              {phone || '(sem telefone)'}
            </Button>
            <Button
              variant="outline"
              className="justify-start rounded-full"
              onClick={sendEmail}
              disabled={!email}
            >
              <Mail className="mr-2 h-4 w-4 text-blue-600" /> E-mail {email || '(sem e-mail)'}
            </Button>
            <Button variant="outline" className="justify-start rounded-full" onClick={copyLink}>
              <Link2 className="mr-2 h-4 w-4 text-purple-600" /> Copiar Link Público
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
