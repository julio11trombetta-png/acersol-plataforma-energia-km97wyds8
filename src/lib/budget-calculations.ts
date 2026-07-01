export function calculateMonthlySavings(valorConta: number, economiaPercentual: number): number {
  return valorConta * (economiaPercentual / 100)
}

export function calculateAnnualSavings(economiaMensal: number): number {
  return economiaMensal * 12
}

export function calculateRequiredCredits(consumoMedio: number): number {
  return consumoMedio
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
