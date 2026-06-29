import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Landmark, Trash2, Edit } from 'lucide-react'
import {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from '@/services/bank-accounts'
import { useRealtime } from '@/hooks/use-realtime'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatters'

export function BankAccountManager() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ bankName: '', agency: '', accountNumber: '', balance: '' })

  const loadData = async () => {
    try {
      setAccounts(await getBankAccounts())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('bank_accounts', () => loadData())

  const openDialog = (acc?: any) => {
    if (acc) {
      setEditing(acc)
      setForm({
        bankName: acc.bankName,
        agency: acc.agency || '',
        accountNumber: acc.accountNumber || '',
        balance: acc.balance ? String(acc.balance) : '',
      })
    } else {
      setEditing(null)
      setForm({ bankName: '', agency: '', accountNumber: '', balance: '' })
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.bankName.trim()) {
      toast.error('Nome do banco obrigatório')
      return
    }
    try {
      const data = {
        bankName: form.bankName,
        agency: form.agency,
        accountNumber: form.accountNumber,
        balance: form.balance ? Number(form.balance) : 0,
      }
      if (editing) {
        await updateBankAccount(editing.id, data)
        toast.success('Conta atualizada!')
      } else {
        await createBankAccount(data)
        toast.success('Conta criada!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBankAccount(id)
      toast.info('Conta removida')
    } catch {
      toast.error('Erro')
    }
  }

  const totalBalance = accounts.reduce((a, r) => a + (r.balance || 0), 0)

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Contas Bancárias</CardTitle>
            <CardDescription>Saldo total: {formatCurrency(totalBalance)}</CardDescription>
          </div>
          <Button
            onClick={() => openDialog()}
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Conta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 space-y-3">
            <div className="h-16 bg-muted/40 rounded-xl animate-pulse" />
            <div className="h-16 bg-muted/40 rounded-xl animate-pulse" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Landmark className="h-12 w-12 text-brand-blue opacity-80" />}
              title="Nenhuma conta bancária"
              description="Cadastre contas para gestão financeira."
              action={
                <Button
                  onClick={() => openDialog()}
                  className="mt-4 rounded-full bg-brand-blue hover:bg-blue-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Cadastrar Conta
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 border rounded-xl hover:shadow-md transition-all bg-gradient-to-br from-background to-muted/20"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-brand-blue/10 p-2">
                      <Landmark className="h-4 w-4 text-brand-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{acc.bankName}</p>
                      <p className="text-xs text-muted-foreground">
                        {acc.agency || '—'} / {acc.accountNumber || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openDialog(acc)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDelete(acc.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
                <Badge variant="outline" className="font-bold">
                  {formatCurrency(acc.balance || 0)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
            <DialogDescription>Cadastre os dados bancários.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Banco</Label>
              <Input
                placeholder="Ex: Banco do Brasil"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agência</Label>
                <Input
                  value={form.agency}
                  onChange={(e) => setForm({ ...form, agency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Conta</Label>
                <Input
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Saldo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })}
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
    </Card>
  )
}
