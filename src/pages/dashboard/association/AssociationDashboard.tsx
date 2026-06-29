import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Ban,
  Search,
  TrendingUp,
  FileSignature,
  Zap,
  DollarSign,
  type LucideIcon,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

interface Kpi {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  filter?: string
}

export default function AssociationDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<Record<string, number>>({})

  const safeCount = async (col: string, filter?: string) => {
    try {
      return (await pb.collection(col).getList(1, 1, { filter: filter || undefined })).totalItems
    } catch {
      return 0
    }
  }
  const safeSum = async (col: string, field: string) => {
    try {
      return (await pb.collection(col).getFullList()).reduce(
        (a: number, r: any) => a + (r[field] || 0),
        0,
      )
    } catch {
      return 0
    }
  }

  const loadData = async () => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const [total, active, suspended, pending, blocked, analysis, newMonth, contracts, ucs, mrr] =
      await Promise.all([
        safeCount('clients'),
        safeCount('clients', 'associateStatus = "Ativo"'),
        safeCount('clients', 'associateStatus = "Suspenso"'),
        safeCount('clients', 'associateStatus = "Pendente"'),
        safeCount('clients', 'associateStatus = "Bloqueado"'),
        safeCount('clients', 'associateStatus = "Em Análise"'),
        safeCount('clients', `created >= "${monthStart}"`),
        safeCount('contracts', 'status = "Ativo"'),
        safeCount('consumer_units'),
        safeSum('invoices', 'amount'),
      ])
    setKpis({ total, active, suspended, pending, blocked, analysis, newMonth, contracts, ucs, mrr })
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('clients', () => loadData())
  useRealtime('contracts', () => loadData())

  const cards: Kpi[] = [
    {
      title: 'Total de Associados',
      value: kpis.total || 0,
      icon: Users,
      color: 'text-brand-blue bg-brand-blue/10',
      filter: '',
    },
    {
      title: 'Ativos',
      value: kpis.active || 0,
      icon: UserCheck,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      filter: 'Ativo',
    },
    {
      title: 'Suspensos',
      value: kpis.suspended || 0,
      icon: UserX,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      filter: 'Suspenso',
    },
    {
      title: 'Pendentes',
      value: kpis.pending || 0,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      filter: 'Pendente',
    },
    {
      title: 'Bloqueados',
      value: kpis.blocked || 0,
      icon: Ban,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/20',
      filter: 'Bloqueado',
    },
    {
      title: 'Em Análise',
      value: kpis.analysis || 0,
      icon: Search,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      filter: 'Em Análise',
    },
    {
      title: 'Novos no Mês',
      value: kpis.newMonth || 0,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Contratos Ativos',
      value: kpis.contracts || 0,
      icon: FileSignature,
      color: 'text-brand-green bg-brand-green/10',
    },
    {
      title: 'Unidades Consumidoras',
      value: kpis.ucs || 0,
      icon: Zap,
      color: 'text-brand-yellow bg-brand-yellow/10',
    },
    {
      title: 'Faturamento Mensal',
      value: `R$ ${(kpis.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-brand-green bg-brand-green/10',
    },
  ]

  const go = (filter?: string) =>
    navigate(`/dashboard/admin/associacao/associados${filter ? `?status=${filter}` : ''}`)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard da Associação</h2>
        <p className="text-muted-foreground">Indicadores em tempo real do módulo de associados.</p>
      </div>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Card
            key={c.title}
            className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => go(c.filter)}
          >
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
        ))}
      </div>
    </div>
  )
}
