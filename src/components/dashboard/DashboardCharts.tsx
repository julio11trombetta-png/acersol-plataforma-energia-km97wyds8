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
  revenueData: { month: string; receita: number }[]
  generationData: { name: string; geracao: number }[]
  growthData: { month: string; associados: number }[]
  flowData: { name: string; value: number }[]
  creditData: { name: string; value: number }[]
}

const PIE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function DashboardCharts({
  revenueData,
  generationData,
  growthData,
  flowData,
  creditData,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartContainer
        config={{ receita: { color: 'hsl(var(--chart-1))' } }}
        className="h-[260px] lg:col-span-2"
      >
        <LineChart data={revenueData}>
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

      <ChartContainer config={{ flow: { color: 'hsl(var(--chart-2))' } }} className="h-[260px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={flowData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
          >
            {flowData.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <ChartContainer
        config={{ geracao: { color: 'hsl(var(--chart-3))' } }}
        className="h-[260px] lg:col-span-2"
      >
        <BarChart data={generationData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis tickLine={false} axisLine={false} fontSize={11} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="geracao" fill="var(--color-geracao)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>

      <ChartContainer
        config={{ associados: { color: 'hsl(var(--chart-4))' } }}
        className="h-[260px]"
      >
        <LineChart data={growthData}>
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
    </div>
  )
}
