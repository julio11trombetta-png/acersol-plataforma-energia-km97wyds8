import pb from '@/lib/pocketbase/client'

export const getDependents = () =>
  pb.collection('dependents').getFullList({ sort: '-created', expand: 'clientId' })

export const getDependentsByClient = (clientId: string) =>
  pb.collection('dependents').getFullList({ filter: `clientId = "${clientId}"`, sort: '-created' })

export const createDependent = (data: any) => pb.collection('dependents').create(data)
export const updateDependent = (id: string, data: any) =>
  pb.collection('dependents').update(id, data)
export const deleteDependent = (id: string) => pb.collection('dependents').delete(id)
