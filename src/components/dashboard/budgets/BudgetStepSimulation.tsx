import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Calendar, Zap, Check, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import {
  checkPlantAvailability,
  AVAILABILITY_COLORS,
  type ConsumptionIndicators,
} from '@/lib/budget-calculations'

interface Props {
  form: any
  set: (k: string, v: any) => void
  plants?: any[]
  indicators: ConsumptionIndicators
  savings: number
  annualSavings: number
  reqCredits: number
  step: number
  saving?: boolean
  onSubmit?: (status: string) => void
}

export function BudgetStepSimulation({
  form,
  set,
  plants,
  indicators,
  savings,
  annualSavings,
  reqCredits,
  step,
  saving,
  onSubmit,
}: Props) {
  if (step === 4) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Simulação Inteligente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Economia Mensal</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(savings || 0)}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Economia Anual</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(annualSavings || 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-muted-foreground">Créditos Necessários</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{reqCredits.toFixed(0)} kWh</p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Média consumo mensal:</span>
            <strong>{indicators.avgConsumption.toFixed(0)} kWh</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Média conta mensal:</span>
            <strong>{formatCurrency(indicators.avgBillValue)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Maior consumo:</span>
            <strong>{indicators.maxConsumption.toFixed(0)} kWh</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Menor consumo:</span>
            <strong>{indicators.minConsumption.toFixed(0)} kWh</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total anual (kWh):</span>
            <strong>{indicators.totalConsumption.toFixed(0)} kWh</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total anual (R$):</span>
            <strong>{formatCurrency(indicators.totalBillValue)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Novo valor estimado:</span>
            <strong className="text-green-600">
              {formatCurrency(indicators.avgBillValue - (savings || 0))}
            </strong>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label>Economia (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={form.economia_percentual}
              onChange={(e) => set('economia_percentual', Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>ICMS (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.impostos_icms}
              onChange={(e) => set('impostos_icms', Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>PIS (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.impostos_pis}
              onChange={(e) => set('impostos_pis', Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>COFINS (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.impostos_cofins}
              onChange={(e) => set('impostos_cofins', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Finalização</h3>
      <div className="space-y-1">
        <Label>Usina Disponível</Label>
        <Select value={form.plant_id} onValueChange={(v) => set('plant_id', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar usina..." />
          </SelectTrigger>
          <SelectContent>
            {(plants || []).map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} - {p.city || p.location || '—'} ({p.potencia_instalada || p.capacity || 0}{' '}
                kWp)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {form.plant_id &&
        (() => {
          const plant = (plants || []).find((p) => p.id === form.plant_id)
          const available = (plant?.generation_now || plant?.potencia_instalada || 0) * 150
          const avail = checkPlantAvailability(reqCredits, available)
          return (
            <Card
              className={
                avail === 'Disponível'
                  ? 'border-green-500'
                  : avail === 'Comprometido'
                    ? 'border-red-500'
                    : 'border-yellow-500'
              }
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{plant?.name}</span>
                  <Badge variant="secondary" className={AVAILABILITY_COLORS[avail]}>
                    {avail}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Créditos disponíveis:</span>
                  <strong>{available} kWh</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Créditos necessários:</span>
                  <strong>{reqCredits.toFixed(0)} kWh</strong>
                </div>
              </CardContent>
            </Card>
          )
        })()}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Validade da Proposta</Label>
          <Input
            type="date"
            value={form.validade}
            onChange={(e) => set('validade', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set('status', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Rascunho', 'Enviado', 'Aprovado'].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label>Observações</Label>
        <Textarea
          rows={3}
          placeholder="Observações sobre o orçamento..."
          value={form.observacoes}
          onChange={(e) => set('observacoes', e.target.value)}
        />
      </div>
      <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
        <h4 className="font-semibold mb-2">Resumo do Orçamento</h4>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cidade:</span>
          <strong>{form.cidade || '—'}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Distribuidora:</span>
          <strong>{form.distribuidora}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Média consumo:</span>
          <strong>{indicators.avgConsumption.toFixed(0)} kWh</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Média conta:</span>
          <strong>{formatCurrency(indicators.avgBillValue)}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Economia mensal:</span>
          <strong className="text-green-600">{formatCurrency(savings)}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Economia anual:</span>
          <strong className="text-green-600">{formatCurrency(annualSavings)}</strong>
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button
          variant="outline"
          className="rounded-full px-6"
          disabled={saving}
          onClick={() => onSubmit?.('Rascunho')}
        >
          Salvar Rascunho
        </Button>
        <Button
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8"
          disabled={saving}
          onClick={() => onSubmit?.(form.status || 'Rascunho')}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Check className="mr-1 h-4 w-4" /> Finalizar
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
