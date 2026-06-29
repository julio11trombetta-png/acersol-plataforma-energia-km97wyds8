import pb from '@/lib/pocketbase/client'

export const getContracts = () =>
  pb.collection('contracts').getFullList({ sort: '-created', expand: 'clientId,plantId' })

export const createContract = (data: any) => pb.collection('contracts').create(data)
export const updateContract = (id: string, data: any) => pb.collection('contracts').update(id, data)
export const deleteContract = (id: string) => pb.collection('contracts').delete(id)
