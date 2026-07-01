export function calculateMonthlySavings(valorConta: number, economiaPercentual: number): number {
  return valorConta * (economiaPercentual / 100)
}

export function calculateAnnualSavings(economiaMensal: number): number {
  return economiaMensal * 12
}

export function calculateRequiredCredits(consumoMedio: number): number {
  return consumoMedio
}

export interface MonthlyRecord {
  mes: string
  consumo_kwh: number
  valor_conta: number
}

export interface ConsumptionIndicators {
  avgConsumption: number
  avgBillValue: number
  totalConsumption: number
  totalBillValue: number
  maxConsumption: number
  minConsumption: number
  maxBillValue: number
  minBillValue: number
  filledMonths: number
}

export function calculateIndicators(records: MonthlyRecord[]): ConsumptionIndicators {
  const filled = records.filter((r) => r.consumo_kwh > 0 || r.valor_conta > 0)
  const consumptions = filled.map((r) => r.consumo_kwh || 0)
  const bills = filled.map((r) => r.valor_conta || 0)
  const count = filled.length || 1
  return {
    avgConsumption: consumptions.reduce((a, b) => a + b, 0) / count,
    avgBillValue: bills.reduce((a, b) => a + b, 0) / count,
    totalConsumption: consumptions.reduce((a, b) => a + b, 0),
    totalBillValue: bills.reduce((a, b) => a + b, 0),
    maxConsumption: consumptions.length ? Math.max(...consumptions) : 0,
    minConsumption: consumptions.length ? Math.min(...consumptions) : 0,
    maxBillValue: bills.length ? Math.max(...bills) : 0,
    minBillValue: bills.length ? Math.min(...bills) : 0,
    filledMonths: filled.length,
  }
}

export function aggregateIndicators(allRecords: MonthlyRecord[][]): ConsumptionIndicators {
  return calculateIndicators(allRecords.flat())
}

export type PlantAvailability = 'Disponível' | 'Comprometido' | 'Livre'

export function checkPlantAvailability(
  creditosNecessarios: number,
  creditosDisponiveis: number,
): PlantAvailability {
  if (creditosDisponiveis === 0) return 'Comprometido'
  if (creditosDisponiveis >= creditosNecessarios) return 'Disponível'
  return 'Livre'
}

export const BUDGET_STATUS = [
  'Rascunho',
  'Enviado',
  'Aprovado',
  'Recusado',
  'Convertido',
  'Expirado',
] as const

export const STATUS_COLORS: Record<string, string> = {
  Rascunho: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  Enviado: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Aprovado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Recusado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Convertido: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Expirado: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export const AVAILABILITY_COLORS: Record<PlantAvailability, string> = {
  Disponível: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Comprometido: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Livre: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
}
