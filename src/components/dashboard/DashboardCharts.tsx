import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from 'recharts'

interface DashboardChartsProps {
  revenue: { month: string; receita: number }[]
  generation: { name: string; geracao: number }[]
  growth: { month: string; associados: number }[]
  flow: { name: string; value: number }[]
  credit: { name: string; value: number }[]
}

const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[260px] bg-muted/20 rounded-lg border border-dashed border-muted-foreground/20">
      <p className="text-sm text-muted-foreground text-center px-4">{message}</p>
    </div>
  )
}

const hasData = (data: any[], field: string) =>
  data.length > 0 && data.some((d) => (d[field] || 0) > 0)

export function DashboardCharts({ revenue, generation, growth, flow }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {!hasData(revenue, 'receita') ? (
        <ChartEmpty message="Aguardando dados históricos de receita" />
      ) : (
        <ChartContainer
          config={{ receita: { color: 'hsl(var(--chart-1))' } }}
          className="h-[260px] lg:col-span-2"
        >
          <LineChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="receita"
              stroke="var(--color-receita)"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      )}

      {!hasData(flow, 'value') ? (
        <ChartEmpty message="Aguardando dados de fluxo de caixa" />
      ) : (
        <ChartContainer config={{ flow: { color: 'hsl(var(--chart-2))' } }} className="h-[260px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={flow}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
            >
              {flow.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      )}

      {!hasData(generation, 'geracao') ? (
        <ChartEmpty message="Aguardando dados de geração energética" />
      ) : (
        <ChartContainer
          config={{ geracao: { color: 'hsl(var(--chart-3))' } }}
          className="h-[260px] lg:col-span-2"
        >
          <BarChart data={generation}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="geracao" fill="var(--color-geracao)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      )}

      {!hasData(growth, 'associados') ? (
        <ChartEmpty message="Aguardando dados de crescimento de associados" />
      ) : (
        <ChartContainer
          config={{ associados: { color: 'hsl(var(--chart-4))' } }}
          className="h-[260px]"
        >
          <LineChart data={growth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="associados"
              stroke="var(--color-associados)"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  )
}
