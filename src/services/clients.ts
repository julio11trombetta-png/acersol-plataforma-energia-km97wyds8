import pb from '@/lib/pocketbase/client'

export const getClients = (page = 1, search = '') => {
  const filter = search ? `name ~ "${search}" || energyUnitId ~ "${search}"` : ''
  return pb.collection('clients').getList(page, 20, { sort: '-created', filter })
}
export const createClient = (data: any) => pb.collection('clients').create(data)
export const updateClient = (id: string, data: any) => pb.collection('clients').update(id, data)
export const deleteClient = (id: string) => pb.collection('clients').delete(id)

export const getAllClients = () => pb.collection('clients').getFullList({ sort: 'name' })
