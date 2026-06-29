import pb from '@/lib/pocketbase/client'

export const getClients = (page = 1, search = '') => {
  const filter = search ? `name ~ "${search}" || energyUnitId ~ "${search}"` : ''
  return pb.collection('clients').getList(page, 20, { sort: '-created', filter })
}
export const createClient = (data: any) => pb.collection('clients').create(data)
export const updateClient = (id: string, data: any) => pb.collection('clients').update(id, data)
export const deleteClient = (id: string) => pb.collection('clients').delete(id)

export const getClientsAdvanced = (params: {
  page?: number
  perPage?: number
  search?: string
  status?: string
  city?: string
  utility?: string
}) => {
  const { page = 1, perPage = 20, search = '', status = '', city = '', utility = '' } = params
  const filters: string[] = []
  if (search) {
    filters.push(
      `(name ~ "${search}" || document_number ~ "${search}" || energyUnitId ~ "${search}")`,
    )
  }
  if (status && status !== 'all') {
    filters.push(`associateStatus = "${status}"`)
  }
  if (city) {
    filters.push(`city ~ "${city}"`)
  }
  if (utility && utility !== 'all') {
    filters.push(`utilityProvider = "${utility}"`)
  }
  const filter = filters.length > 0 ? filters.join(' && ') : undefined
  return pb.collection('clients').getList(page, perPage, { sort: '-created', filter })
}

export const getAllClients = () => pb.collection('clients').getFullList({ sort: 'name' })
export const getClientById = (id: string) => pb.collection('clients').getOne(id)

export const getClientByDocument = (document: string) =>
  pb.collection('clients').getFirstListItem(`document_number = "${document}"`)

export const checkDocumentExists = async (document: string, excludeId?: string) => {
  try {
    const filter = excludeId
      ? `document_number = "${document}" && id != "${excludeId}"`
      : `document_number = "${document}"`
    const [clientResults, plantResults] = await Promise.all([
      pb.collection('clients').getList(1, 1, { filter }),
      pb.collection('plants').getList(1, 1, { filter }),
    ])
    return clientResults.items.length > 0 || plantResults.items.length > 0
  } catch {
    return false
  }
}
