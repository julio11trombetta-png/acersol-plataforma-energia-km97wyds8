import pb from '@/lib/pocketbase/client'
import { getBudgetUnits } from '@/services/budget-units'
import { getMonthlyConsumption } from '@/services/budget-monthly-consumption'
import { cleanNumber } from '@/lib/formatters'

export interface BudgetFilters {
  search?: string
  status?: string
  cidade?: string
  distribuidora?: string
  responsavel?: string
  dataInicio?: string
  dataFim?: string
}

export const getBudgets = (page = 1, perPage = 20, filters: BudgetFilters = {}) => {
  const parts: string[] = ['deleted_at = null']
  if (filters.search)
    parts.push(
      `(numero ~ "${filters.search}" || cidade ~ "${filters.search}" || distribuidora ~ "${filters.search}" || responsavel ~ "${filters.search}")`,
    )
  if (filters.status && filters.status !== 'all') parts.push(`status = "${filters.status}"`)
  if (filters.cidade) parts.push(`cidade ~ "${filters.cidade}"`)
  if (filters.distribuidora && filters.distribuidora !== 'all')
    parts.push(`distribuidora = "${filters.distribuidora}"`)
  if (filters.responsavel) parts.push(`responsavel ~ "${filters.responsavel}"`)
  if (filters.dataInicio) parts.push(`created >= "${filters.dataInicio} 00:00:00"`)
  if (filters.dataFim) parts.push(`created <= "${filters.dataFim} 23:59:59"`)
  return pb.collection('budgets').getList(page, perPage, {
    sort: '-created',
    filter: parts.join(' && '),
    expand: 'lead_id,client_id,plant_id',
  })
}

export const getAllBudgets = () =>
  pb.collection('budgets').getFullList({
    sort: '-created',
    filter: 'deleted_at = null',
    expand: 'lead_id,client_id,plant_id',
  })

export const getBudget = (id: string) =>
  pb.collection('budgets').getOne(id, { expand: 'lead_id,client_id,plant_id' })

export const createBudget = (data: any) => pb.collection('budgets').create(data)
export const updateBudget = (id: string, data: any) => pb.collection('budgets').update(id, data)
export const softDeleteBudget = (id: string) =>
  pb.collection('budgets').update(id, { deleted_at: new Date().toISOString() })

export const duplicateBudget = async (id: string) => {
  const original = await getBudget(id)
  const {
    id: _id,
    created,
    updated,
    numero,
    uuid,
    friendly_code,
    deleted_at,
    pdf,
    ...rest
  } = original as any
  return createBudget({ ...rest, status: 'Rascunho' })
}

export const convertToAssociate = async (id: string) => {
  const budget = await getBudget(id)
  const lead = budget.expand?.lead_id
  const clientData: any = {
    name: lead?.company || budget.expand?.client_id?.name || 'N/D',
    document_number: cleanNumber(lead?.cnpj || ''),
    city: budget.cidade || '',
    state: budget.estado || '',
    utilityProvider: budget.distribuidora || '',
    energyUnitId: budget.uc || 'N/D',
    associateStatus: 'Ativo',
    associateType: 'Pessoa Jurídica',
  }
  const client = await pb.collection('clients').create(clientData)
  if (budget.lead_id) {
    await pb.collection('crm_leads').update(budget.lead_id, { status: 'Assinado' })
  }
  const files = await getBudgetFiles(id)
  for (const f of files) {
    try {
      const url = pb.files.getUrl(f, (f as any).file)
      const res = await fetch(url)
      const blob = await res.blob()
      const file = new File([blob], (f as any).file_name || 'document.pdf', { type: blob.type })
      const formData = new FormData()
      formData.append('clientId', client.id)
      formData.append('category', 'Fatura')
      formData.append('fileName', (f as any).file_name || '')
      formData.append('file', file)
      formData.append('uploadedBy', pb.authStore.record?.id || '')
      await pb.collection('associate_documents').create(formData)
    } catch {
      /* intentionally ignored */
    }
  }
  const budgetUnits = await getBudgetUnits(id)
  const monthlyRecords = await getMonthlyConsumption(id)
  for (const bu of budgetUnits) {
    const unitRecords = monthlyRecords.filter((r: any) => r.unit_id === bu.id)
    const avgConsumption =
      unitRecords.length > 0
        ? unitRecords.reduce((sum: number, r: any) => sum + (r.consumo_kwh || 0), 0) /
          unitRecords.length
        : 0
    await pb.collection('consumer_units').create({
      clientId: client.id,
      ucCode: bu.numero_uc || '',
      utility: bu.distribuidora || '',
      ucClass: bu.classe || '',
      tariffGroup: bu.grupo_tarifario || '',
      subgroup: bu.subclasse || '',
      modality: bu.modalidade || '',
      averageConsumption: avgConsumption,
      status: bu.status || 'Ativa',
    })
    for (const r of unitRecords) {
      if (r.consumo_kwh > 0 || r.valor_conta > 0) {
        await pb.collection('consumptions').create({
          month: r.mes || '',
          consumo: r.consumo_kwh || 0,
          creditos: 0,
          clientId: client.id,
        })
      }
    }
  }
  await updateBudget(id, { client_id: client.id, status: 'Convertido' })
  await logBudgetAction(id, 'Convertido em Associado', `Cliente criado: ${client.id}`)
  return client
}

export const getBudgetFiles = (budgetId: string) =>
  pb
    .collection('budget_files')
    .getFullList({ filter: `budget_id = "${budgetId}"`, sort: '-created' })

export const createBudgetFile = (budgetId: string, file: File, fileName: string) => {
  const user = pb.authStore.record
  const formData = new FormData()
  formData.append('budget_id', budgetId)
  formData.append('file', file)
  formData.append('file_name', fileName)
  formData.append('uploaded_by', user?.id || '')
  return pb.collection('budget_files').create(formData)
}

export const deleteBudgetFile = (id: string) => pb.collection('budget_files').delete(id)

export const getBudgetHistory = (budgetId: string) =>
  pb
    .collection('budget_history')
    .getFullList({ filter: `budget_id = "${budgetId}"`, sort: '-created', expand: 'user_id' })

export const logBudgetAction = async (
  budgetId: string,
  action: string,
  details?: string,
  fieldChanges?: any,
) => {
  const user = pb.authStore.record
  return pb.collection('budget_history').create({
    budget_id: budgetId,
    user_id: user?.id || '',
    user_name: user?.name || user?.email || '',
    action,
    details: details || '',
    field_changes: fieldChanges ? JSON.stringify(fieldChanges) : JSON.stringify({}),
  })
}

export const getBudgetMessages = (budgetId: string) =>
  pb
    .collection('budget_messages')
    .getFullList({ filter: `budget_id = "${budgetId}"`, sort: '-created' })

export const createBudgetMessage = (data: {
  budget_id: string
  channel: string
  recipient: string
  content: string
  status: string
}) => {
  const user = pb.authStore.record
  return pb.collection('budget_messages').create({
    ...data,
    sent_by: user?.id || '',
    sent_by_name: user?.name || user?.email || '',
  })
}
