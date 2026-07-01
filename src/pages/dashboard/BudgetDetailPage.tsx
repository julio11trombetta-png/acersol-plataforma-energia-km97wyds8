import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowLeft, FileText, Copy, UserPlus, Send, Edit, Sparkles } from 'lucide-react'
import {
  getBudget,
  getBudgetFiles,
  duplicateBudget,
  convertToAssociate,
  logBudgetAction,
} from '@/services/budgets'
import { generateBudgetPDF } from '@/lib/budget-pdf'
import { generatePremiumCatalogPDF } from '@/lib/premium-pdf/catalog-generator'
import { STATUS_COLORS } from '@/lib/budget-calculations'
import { formatCurrency } from '@/lib/formatters'
import { getBudgetUnits } from '@/services/budget-units'
import { getMonthlyConsumption } from '@/services/budget-monthly-consumption'
import { useRealtime } from '@/hooks/use-realtime'
import { BudgetTimeline } from '@/components/dashboard/budgets/BudgetTimeline'
import { BudgetCommunication } from '@/components/dashboard/budgets/BudgetCommunication'
import { toast } from 'sonner'

export default function BudgetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [budget, setBudget] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [commOpen, setCommOpen] = useState(false)

  const loadData = async () => {
    if (!id) return
    try {
      const [b, f, u, m] = await Promise.all([
        getBudget(id),
        getBudgetFiles(id),
        getBudgetUnits(id),
        getMonthlyConsumption(id),
      ])
      setBudget(b)
      setFiles(f)
      setUnits(u)
      setMonthlyData(m)
      await logBudgetAction(id, 'View', 'Orçamento visualizado')
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])
  useRealtime('budgets', () => loadData())

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <FileText className="h-8 w-8 animate-pulse text-muted-foreground" />
      </div>
    )
  if (!budget)
    return <div className="text-center py-20 text-muted-foreground">Orçamento não encontrado.</div>

  const client = budget.expand?.client_id || budget.expand?.lead_id

  const handleDuplicate = async () => {
    try {
      await duplicateBudget(budget.id)
      toast.success('Duplicado!')
      navigate('/dashboard/admin/comercial/orcamentos')
    } catch {
      toast.error('Erro')
    }
  }
  const handleConvert = async () => {
    try {
      await convertToAssociate(budget.id)
      toast.success('Convertido!')
      loadData()
    } catch {
      toast.error('Erro')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/admin/comercial/orcamentos')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight font-mono">{budget.numero}</h2>
            <Badge variant="secondary" className={STATUS_COLORS[budget.status] || ''}>
              {budget.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {client?.name || client?.company || '—'} • {budget.cidade || '—'} -{' '}
            {budget.estado || '—'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
            onClick={() =>
              generatePremiumCatalogPDF(budget, units, monthlyData).catch(() =>
                toast.error('Erro ao gerar catálogo'),
              )
            }
          >
            <Sparkles className="mr-1 h-4 w-4" /> Catálogo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => generateBudgetPDF(budget)}
          >
            <FileText className="mr-1 h-4 w-4" /> PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setCommOpen(true)}
          >
            <Send className="mr-1 h-4 w-4" /> Enviar
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleDuplicate}>
            <Copy className="mr-1 h-4 w-4" /> Duplicar
          </Button>
          {budget.status !== 'Convertido' && (
            <Button
              size="sm"
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleConvert}
            >
              <UserPlus className="mr-1 h-4 w-4" /> Converter
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Economia %</p>
            <p className="text-xl font-bold">{budget.economia_percentual || 0}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Economia Mensal</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(budget.economia_mensal || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Economia Anual</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(budget.economia_anual || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Créditos Necessários</p>
            <p className="text-xl font-bold text-orange-600">
              {budget.creditos_necessarios || 0} kWh
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="units">Unidades</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Distribuidora:</span>{' '}
                  <strong>{budget.distribuidora || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Unidade Consumidora:</span>{' '}
                  <strong>{budget.uc || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Classe:</span>{' '}
                  <strong>{budget.classe || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Modalidade:</span>{' '}
                  <strong>{budget.modalidade || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Economia Mensal:</span>{' '}
                  <strong>{formatCurrency(budget.economia_mensal || 0)}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Economia:</span>{' '}
                  <strong>{budget.economia_percentual || 0}%</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Responsável:</span>{' '}
                  <strong>{budget.responsavel || '—'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Validade:</span>{' '}
                  <strong>
                    {budget.validade ? new Date(budget.validade).toLocaleDateString('pt-BR') : '—'}
                  </strong>
                </div>
              </div>
              {budget.observacoes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground">Observações:</span>
                  <p className="mt-1">{budget.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timeline">
          <Card>
            <CardContent className="p-0">
              <BudgetTimeline budgetId={budget.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="units">
          <Card>
            <CardContent className="p-4">
              {units.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma UC vinculada.
                </p>
              ) : (
                <div className="space-y-3">
                  {units.map((u) => {
                    const unitMonthly = monthlyData.filter((m) => m.unit_id === u.id)
                    const totalKwh = unitMonthly.reduce((s, m) => s + (m.consumo_kwh || 0), 0)
                    const totalValue = unitMonthly.reduce((s, m) => s + (m.valor_conta || 0), 0)
                    return (
                      <div key={u.id} className="border rounded-lg p-3 space-y-1">
                        <div className="flex justify-between">
                          <strong className="font-mono text-sm">{u.numero_uc}</strong>
                          <span className="text-xs text-muted-foreground">
                            {u.distribuidora || '—'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {u.cidade || '—'}/{u.estado || '—'}
                          </span>
                          <span className="text-muted-foreground">{u.classe || '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total: {totalKwh.toFixed(0)} kWh
                          </span>
                          <span className="text-muted-foreground">
                            {formatCurrency(totalValue)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="files">
          <Card>
            <CardContent className="p-4">
              {files.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum arquivo anexado.
                </p>
              ) : (
                <div className="space-y-2">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                      <FileText className="h-4 w-4 text-brand-blue" />
                      <span className="text-sm flex-1 truncate">{f.file_name || 'Arquivo'}</span>
                      <a
                        href={
                          f.file
                            ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/budget_files/${f.id}/${f.file}`
                            : '#'
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-blue hover:underline"
                      >
                        Baixar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <BudgetCommunication open={commOpen} onOpenChange={setCommOpen} budget={budget} />
    </div>
  )
}
