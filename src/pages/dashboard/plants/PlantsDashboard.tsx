import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { DashboardStatsCard } from '@/components/dashboard/DashboardStatsCard'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import {
  Users,
  Zap,
  Sun,
  Activity,
  TrendingUp,
  BatteryCharging,
  Clock,
  Wrench,
  Gauge,
  CalendarClock,
} from 'lucide-react'

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

export default function PlantsDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Record<string, number | string>>({})
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const today = now.toISOString().slice(0, 10)
    const [total, active, homolog, proj, maint, gen, cred, clients, gens] = await Promise.all([
      safeCount('plants'),
      safeCount('plants', 'status = "Ativa"'),
      safeCount('plants', 'status = "Em Homologação"'),
      safeCount('plants', 'status = "Em Projeto"'),
      safeCount('plants', 'status = "Manutenção"'),
      safeSum('plant_generation', 'generation'),
      safeSum('consumptions', 'creditos'),
      safeCount('clients'),
      pb
        .collection('plant_generation')
        .getFullList()
        .catch(() => []),
    ])
    let eff = 0
    const validGens = (gens as any[]).filter((g) => g.generation > 0)
    if (validGens.length)
      eff =
        validGens.reduce((a, g) => a + ((g.injetada || 0) / g.generation) * 100, 0) /
        validGens.length
    let nextMaint = 'Não agendada'
    try {
      const nm = await pb
        .collection('plant_maintenances')
        .getList(1, 1, { filter: `status = "Agendada" && date >= "${today}"`, sort: 'date' })
      if (nm.items.length) nextMaint = new Date(nm.items[0].date).toLocaleDateString('pt-BR')
    } catch {
      /* intentionally ignored */
    }
    setStats({
      total,
      active,
      homolog,
      proj,
      maint,
      gen,
      cred,
      clients,
      eff: Math.round(eff),
      nextMaint,
    })
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('plants', () => loadData())
  useRealtime('plant_generation', () => loadData())
  useRealtime('plant_maintenances', () => loadData())

  if (!loading && stats.total === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={<Zap className="h-10 w-10 text-brand-green" />}
          title="Não existem usinas cadastradas"
          description="Comece cadastrando a primeira usina solar da plataforma."
          action={
            <Button
              className="mt-4 rounded-full bg-brand-green hover:bg-green-700 text-white"
              onClick={() => navigate('/dashboard/admin/plants/registro')}
            >
              Cadastrar Usina
            </Button>
          }
        />
      </div>
    )
  }

  const cards = [
    {
      title: 'Total de Usinas',
      value: stats.total ?? 0,
      icon: Zap,
      color: 'text-brand-green bg-brand-green/10',
      path: '/dashboard/admin/plants/registro',
    },
    {
      title: 'Usinas Ativas',
      value: stats.active ?? 0,
      icon: Activity,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      path: '/dashboard/admin/plants/registro',
    },
    {
      title: 'Em Homologação',
      value: stats.homolog ?? 0,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      path: '/dashboard/admin/plants/registro',
    },
    {
      title: 'Em Projeto',
      value: stats.proj ?? 0,
      icon: Sun,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      path: '/dashboard/admin/plants/registro',
    },
    {
      title: 'Em Manutenção',
      value: stats.maint ?? 0,
      icon: Wrench,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      path: '/dashboard/admin/plants/manutencoes',
    },
    {
      title: 'Energia Gerada (kWh)',
      value: (stats.gen ?? 0).toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'text-brand-yellow bg-brand-yellow/10',
      path: '/dashboard/admin/plants/geracao',
    },
    {
      title: 'Créditos Disponíveis (kWh)',
      value: (stats.cred ?? 0).toLocaleString('pt-BR'),
      icon: BatteryCharging,
      color: 'text-brand-orange bg-brand-orange/10',
      path: '/dashboard/admin/plants/creditos',
    },
    {
      title: 'Associados Atendidos',
      value: stats.clients ?? 0,
      icon: Users,
      color: 'text-brand-blue bg-brand-blue/10',
      path: '/dashboard/admin/clients',
    },
    {
      title: 'Eficiência Média',
      value: `${stats.eff ?? 0}%`,
      icon: Gauge,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
      path: '/dashboard/admin/plants/geracao',
    },
    {
      title: 'Próxima Manutenção',
      value: stats.nextMaint ?? '—',
      icon: CalendarClock,
      color: 'text-brand-blue bg-brand-blue/10',
      path: '/dashboard/admin/plants/manutencoes',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Usinas</h2>
        <p className="text-muted-foreground">Visão geral do parque gerador solar.</p>
      </div>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <DashboardStatsCard
            key={c.title}
            title={c.title}
            value={c.value}
            icon={c.icon}
            color={c.color}
            path={c.path}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}
