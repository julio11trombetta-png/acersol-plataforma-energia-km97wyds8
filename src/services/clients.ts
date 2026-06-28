import pb from '@/lib/pocketbase/client'

export const getClients = (page = 1, search = '') => {
  const filter = search ? `name ~ "${search}" || energyUnitId ~ "${search}"` : ''
  return pb.collection('clients').getList(page, 20, { sort: '-created', filter })
}
export const createClient = (data: any) => pb.collection('clients').create(data)
export const updateClient = (id: string, data: any) => pb.collection('clients').update(id, data)
export const deleteClient = (id: string) => pb.collection('clients').delete(id)

export const getAllClients = () => pb.collection('clients').getFullList({ sort: 'name' })
export const getClientById = (id: string) => pb.collection('clients').getOne(id)

export const checkDocumentExists = async (document: string, excludeId?: string) => {
  try {
    const filter = excludeId
      ? `document_number = "${document}" && id != "${excludeId}"`
      : `document_number = "${document}"`
    const results = await pb.collection('clients').getList(1, 1, { filter })
    return results.items.length > 0
  } catch {
    return false
  }
}
