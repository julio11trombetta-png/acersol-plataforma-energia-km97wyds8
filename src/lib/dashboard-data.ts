import pb from '@/lib/pocketbase/client'

export interface DashboardChartData {
  revenue: { month: string; receita: number }[]
  generation: { name: string; geracao: number }[]
  growth: { month: string; associados: number }[]
  flow: { name: string; value: number }[]
  credit: { name: string; value: number }[]
}

const safeFetch = async (col: string, opts?: any): Promise<any[]> => {
  try {
    return await pb.collection(col).getFullList(opts)
  } catch {
    return []
  }
}

const monthLabel = (d: any) => {
  try {
    return new Date(d.created || d.month || Date.now()).toLocaleDateString('pt-BR', {
      month: 'short',
    })
  } catch {
    return '—'
  }
}

export async function fetchDashboardCharts(): Promise<DashboardChartData> {
  const [invoices, cashFlow, generation, consumptions, allClients] = await Promise.all([
    safeFetch('invoices', { sort: 'created' }),
    safeFetch('cash_flow', { sort: 'created' }),
    safeFetch('plant_generation', { sort: '-created', expand: 'plantId' }),
    safeFetch('consumptions', { sort: 'created' }),
    safeFetch('clients', { sort: 'created' }),
  ])

  const revMap: Record<string, number> = {}
  invoices.forEach((inv: any) => {
    const m = inv.month || monthLabel(inv)
    revMap[m] = (revMap[m] || 0) + (inv.amount || 0)
  })
  const revenue = Object.entries(revMap)
    .slice(-6)
    .map(([month, receita]) => ({ month, receita }))

  const genMap: Record<string, number> = {}
  generation.forEach((g: any) => {
    const name = g.expand?.plantId?.name || 'Usina'
    genMap[name] = (genMap[name] || 0) + (g.generation || 0)
  })
  const generationChart = Object.entries(genMap)
    .slice(0, 5)
    .map(([name, geracao]) => ({ name, geracao }))

  const growthMap: Record<string, number> = {}
  let cumulative = 0
  allClients.forEach((c: any) => {
    const m = monthLabel(c)
    cumulative++
    growthMap[m] = cumulative
  })
  const growth = Object.entries(growthMap)
    .slice(-6)
    .map(([month, associados]) => ({ month, associados }))

  const cashIn = cashFlow
    .filter((c: any) => c.type === 'Entrada')
    .reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const cashOut = cashFlow
    .filter((c: any) => c.type === 'Saida')
    .reduce((a: number, c: any) => a + (c.amount || 0), 0)
  const flow = [
    { name: 'Entradas', value: cashIn },
    { name: 'Saídas', value: cashOut },
  ]

  const totalCredits = consumptions.reduce((a: number, c: any) => a + (c.creditos || 0), 0)
  const credit = [{ name: 'Créditos', value: totalCredits }]

  return { revenue, generation: generationChart, growth, flow, credit }
}
