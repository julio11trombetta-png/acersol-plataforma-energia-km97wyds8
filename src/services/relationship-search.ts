import pb from '@/lib/pocketbase/client'

function prioritySort(a: any, b: any, query: string) {
  const q = query.toLowerCase()
  const score = (r: any) => {
    if (r.friendly_code?.toLowerCase().includes(q)) return 5
    if (r.name?.toLowerCase().includes(q)) return 4
    if (r.document_number?.toLowerCase().includes(q)) return 3
    if (r.city?.toLowerCase().includes(q)) return 2
    if (r.company?.toLowerCase().includes(q)) return 1
    return 0
  }
  return score(b) - score(a)
}

export async function searchRecords(
  collection: string,
  searchFields: string[],
  query: string,
  limit = 10,
) {
  const q = query.trim()
  if (!q) {
    const res = await pb.collection(collection).getList(1, limit, { sort: '-created' })
    return res.items as any[]
  }
  const escaped = q.replace(/"/g, '\\"')
  const filter = searchFields.map((f) => `${f} ~ "${escaped}"`).join(' || ')
  const res = await pb.collection(collection).getList(1, limit, { filter, sort: '-created' })
  const items = res.items as any[]
  return items.sort((a, b) => prioritySort(a, b, q))
}

export async function getRecordById(collection: string, id: string) {
  return (await pb.collection(collection).getOne(id)) as any
}

export async function findClientByDocument(document: string) {
  const digits = document.replace(/\D/g, '')
  const filter = `document_number = "${document}" || document_number = "${digits}"`
  try {
    return await pb.collection('clients').getFirstListItem(filter)
  } catch {
    return null
  }
}

const RELATION_MAP: Record<
  string,
  Array<{ col: string; field: string; label: string; route?: string }>
> = {
  clients: [
    { col: 'plants', field: 'clientId', label: 'Usinas', route: '/dashboard/admin/usinas' },
    { col: 'consumer_units', field: 'clientId', label: 'Unidades Consumidoras' },
    { col: 'contracts', field: 'clientId', label: 'Contratos' },
    { col: 'associate_documents', field: 'clientId', label: 'Documentos' },
    { col: 'invoices', field: 'clientId', label: 'Faturas' },
    { col: 'tickets', field: 'clientId', label: 'Chamados' },
    { col: 'occurrences', field: 'clientId', label: 'Ocorrências' },
    { col: 'dependents', field: 'clientId', label: 'Dependentes' },
  ],
  plants: [
    { col: 'plant_generation', field: 'plantId', label: 'Gerações' },
    { col: 'plant_equipments', field: 'plantId', label: 'Equipamentos' },
    { col: 'plant_maintenances', field: 'plantId', label: 'Manutenções' },
    { col: 'plant_documents', field: 'plantId', label: 'Documentos' },
    { col: 'contracts', field: 'plantId', label: 'Contratos' },
  ],
}

export async function getRelatedCounts(collection: string, recordId: string) {
  const rels = RELATION_MAP[collection]
  if (!rels) return []
  const results = await Promise.all(
    rels.map(async (config) => {
      try {
        const res = await pb.collection(config.col).getList(1, 1, {
          filter: `${config.field} = "${recordId}"`,
        })
        return { key: config.col, label: config.label, count: res.totalItems, route: config.route }
      } catch {
        return { key: config.col, label: config.label, count: 0, route: config.route }
      }
    }),
  )
  return results.filter((r) => r.count > 0)
}
