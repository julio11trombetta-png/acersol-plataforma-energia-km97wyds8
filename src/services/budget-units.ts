import pb from '@/lib/pocketbase/client'

export interface BudgetUnit {
  id?: string
  budget_id: string
  numero_uc: string
  distribuidora?: string
  cidade?: string
  estado?: string
  classe?: string
  subclasse?: string
  modalidade?: string
  grupo_tarifario?: string
  status?: string
}

export const getBudgetUnits = (budgetId: string) =>
  pb.collection('budget_units').getFullList({
    filter: `budget_id = "${budgetId}"`,
    sort: 'created',
  })

export const createBudgetUnit = (data: Partial<BudgetUnit>) =>
  pb.collection('budget_units').create(data)

export const updateBudgetUnit = (id: string, data: Partial<BudgetUnit>) =>
  pb.collection('budget_units').update(id, data)

export const deleteBudgetUnit = (id: string) => pb.collection('budget_units').delete(id)
