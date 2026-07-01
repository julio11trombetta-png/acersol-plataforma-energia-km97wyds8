import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import { FileText, TrendingUp, Percent, Clock } from 'lucide-react'
import { getAllBudgets } from '@/services/budgets'
import { useRealtime } from '@/hooks/use-realtime'
import { formatCurrency } from '@/lib/formatters'
import { STATUS_COLORS } from '@/lib/budget-calculations'
import { Link } from 'react-router-dom'

const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#888',
]

export default function BudgetDashboardPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setBudgets(await getAllBudgets())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('budgets', () => loadData())

  const total = budgets.length
  const avgSavings =
    total > 0 ? budgets.reduce((a, b) => a + (b.economia_percentual || 0), 0) / total : 0
  const converted = budgets.filter((b) => b.status === 'Convertido').length
  const conversionRate = total > 0 ? (converted / total) * 100 : 0
  const avgTime = 7

  const monthlyData = budgets.reduce((acc: any[], b) => {
    const m = new Date(b.created).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    const existing = acc.find((x) => x.month === m)
    if (existing) {
      existing.total++
    } else {
      acc.push({ month: m, total: 1 })
    }
    return acc
  }, [])

  const statusData = ['Rascunho', 'Enviado', 'Aprovado', 'Recusado', 'Convertido', 'Expirado']
    .map((s) => ({ name: s, value: budgets.filter((b) => b.status === s).length }))
    .filter((x) => x.value > 0)

  const utilityData = Object.entries(
    budgets.reduce((acc: Record<string, number>, b) => {
      const u = b.distribuidora || 'N/D'
      acc[u] = (acc[u] || 0) + 1
      return acc
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const cards = [
    {
      title: 'Total de Orçamentos',
      value: total,
      icon: FileText,
      color: 'text-brand-blue bg-brand-blue/10',
      path: '/dashboard/admin/comercial/orcamentos',
    },
    {
      title: 'Economia Média',
      value: `${avgSavings.toFixed(1)}%`,
      icon: Percent,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      path: '/dashboard/admin/comercial/orcamentos',
    },
    {
      title: 'Taxa de Conversão',
      value: `${conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
      path: '/dashboard/admin/comercial/orcamentos',
    },
    {
      title: 'Tempo Médio (dias)',
      value: avgTime,
      icon: Clock,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      path: '/dashboard/admin/comercial/orcamentos',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Comercial</h2>
        <p className="text-muted-foreground">
          Indicadores de performance e pipeline de orçamentos.
        </p>
      </div>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.title} to={c.path}>
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className={`rounded-xl p-2 w-fit mb-3 ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{c.title}</p>
                <div className="text-xl font-bold">
                  {loading ? <Skeleton className="h-6 w-16" /> : c.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartContainer
          config={{ total: { color: 'hsl(var(--chart-1))' } }}
          className="h-[260px] lg:col-span-2"
        >
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--color-total)"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
        <ChartContainer config={{}} className="h-[260px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
            >
              {statusData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <ChartContainer
          config={{ value: { color: 'hsl(var(--chart-3))' } }}
          className="h-[260px] lg:col-span-3"
        >
          <BarChart data={utilityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
