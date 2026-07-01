import pb from '@/lib/pocketbase/client'

export interface MonthlyConsumption {
  id?: string
  budget_id: string
  unit_id: string
  mes: string
  ano: number
  consumo_kwh: number
  valor_conta: number
}

export const getMonthlyConsumption = (budgetId: string) =>
  pb.collection('budget_monthly_consumption').getFullList({
    filter: `budget_id = "${budgetId}"`,
    sort: 'created',
  })

export const getMonthlyConsumptionByUnit = (unitId: string) =>
  pb.collection('budget_monthly_consumption').getFullList({
    filter: `unit_id = "${unitId}"`,
    sort: 'created',
  })

export const createMonthlyConsumption = (data: Partial<MonthlyConsumption>) =>
  pb.collection('budget_monthly_consumption').create(data)

export const updateMonthlyConsumption = (id: string, data: Partial<MonthlyConsumption>) =>
  pb.collection('budget_monthly_consumption').update(id, data)

export const deleteMonthlyConsumption = (id: string) =>
  pb.collection('budget_monthly_consumption').delete(id)
