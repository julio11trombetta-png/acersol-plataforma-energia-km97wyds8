export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function extractYear(monthField: string): string {
  const match = (monthField || '').match(/\d{4}/)
  return match ? match[0] : ''
}

export function extractMonthName(monthField: string): string {
  const lower = (monthField || '').toLowerCase()
  return MONTHS.find((m) => lower.includes(m.toLowerCase())) || ''
}

export function filterByMonthYear(records: any[], month: string, year: string): any[] {
  return records.filter((r) => {
    const recMonth = extractMonthName(r.month || '')
    const recYear = extractYear(r.month || '')
    return (!month || recMonth === month) && (!year || recYear === year)
  })
}

export function getUniqueYears(records: any[]): string[] {
  return [...new Set(records.map((r) => extractYear(r.month || '')).filter(Boolean))]
    .sort()
    .reverse()
}
