import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, BatteryCharging, Share2, DollarSign } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

export default function PlantsCredits() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ generated: 0, injected: 0, consumed: 0, credits: 0 })

  const loadData = async () => {
    try {
      const [gens, consumptions] = await Promise.all([
        pb.collection('plant_generation').getFullList(),
        pb.collection('consumptions').getFullList(),
      ])
      setStats({
        generated: (gens as any[]).reduce((a, r) => a + (r.generation || 0), 0),
        injected: (gens as any[]).reduce((a, r) => a + (r.injetada || 0), 0),
        consumed: (consumptions as any[]).reduce((a, r) => a + (r.consumo || 0), 0),
        credits: (consumptions as any[]).reduce((a, r) => a + (r.creditos || 0), 0),
      })
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('plant_generation', () => loadData())
  useRealtime('consumptions', () => loadData())

  const cards = [
    {
      title: 'Energia Gerada',
      value: `${stats.generated.toLocaleString('pt-BR')} kWh`,
      icon: TrendingUp,
      color: 'text-brand-green bg-brand-green/10',
    },
    {
      title: 'Energia Injetada',
      value: `${stats.injected.toLocaleString('pt-BR')} kWh`,
      icon: Share2,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Créditos Disponíveis',
      value: `${stats.credits.toLocaleString('pt-BR')} kWh`,
      icon: BatteryCharging,
      color: 'text-brand-orange bg-brand-orange/10',
    },
    {
      title: 'Consumo Associados',
      value: `${stats.consumed.toLocaleString('pt-BR')} kWh`,
      icon: DollarSign,
      color: 'text-brand-yellow bg-brand-yellow/10',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Créditos de Energia</h2>
        <p className="text-muted-foreground">Resumo de geração vs. distribuição de créditos.</p>
      </div>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title} className="hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className={`rounded-xl p-2 w-fit mb-3 ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{c.title}</p>
              <div className="text-xl font-bold">
                {loading ? <Skeleton className="h-6 w-20" /> : c.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
