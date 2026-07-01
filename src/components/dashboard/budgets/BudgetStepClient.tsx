import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BRAZILIAN_STATES, UTILITY_PROVIDERS } from '@/lib/regional-data'
import { formatDocument, formatPhone } from '@/lib/formatters'

interface Props {
  form: any
  set: (k: string, v: any) => void
  leads: any[]
  clients: any[]
}

export function BudgetStepClient({ form, set, leads, clients }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Seleção de Cliente ou Lead</h3>
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'lead', label: 'Lead Existente' },
          { key: 'client', label: 'Cliente Existente' },
          { key: 'new', label: 'Novo Cadastro' },
        ].map((t) => (
          <Button
            key={t.key}
            variant={form.clientType === t.key ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => set('clientType', t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      {form.clientType === 'lead' && (
        <div className="space-y-1">
          <Label>Selecionar Lead</Label>
          <Select value={form.lead_id} onValueChange={(v) => set('lead_id', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Buscar lead..." />
            </SelectTrigger>
            <SelectContent>
              {leads.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.company} {l.cnpj ? `- ${l.cnpj}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {form.clientType === 'client' && (
        <div className="space-y-1">
          <Label>Selecionar Cliente</Label>
          <Select value={form.client_id} onValueChange={(v) => set('client_id', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Buscar cliente..." />
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
      )}
      {form.clientType === 'new' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Nome / Empresa</Label>
            <Input
              placeholder="Nome completo"
              value={form.newClientName}
              onChange={(e) => set('newClientName', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>CPF / CNPJ</Label>
            <Input
              placeholder="000.000.000-00"
              value={form.newClientDoc}
              onChange={(e) => set('newClientDoc', formatDocument(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>Telefone</Label>
            <Input
              placeholder="(00) 00000-0000"
              value={form.newClientPhone}
              onChange={(e) => set('newClientPhone', formatPhone(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input
              placeholder="email@exemplo.com"
              value={form.newClientEmail}
              onChange={(e) => set('newClientEmail', e.target.value)}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
        <div className="space-y-1">
          <Label>Cidade</Label>
          <Input
            placeholder="Cidade"
            value={form.cidade}
            onChange={(e) => set('cidade', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Estado</Label>
          <Select value={form.estado} onValueChange={(v) => set('estado', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRAZILIAN_STATES.map((s) => (
                <SelectItem key={s.code} value={s.code}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Distribuidora</Label>
          <Select value={form.distribuidora} onValueChange={(v) => set('distribuidora', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UTILITY_PROVIDERS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
