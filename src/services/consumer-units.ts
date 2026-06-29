import pb from '@/lib/pocketbase/client'

export const getConsumerUnits = () =>
  pb.collection('consumer_units').getFullList({ sort: '-created', expand: 'clientId' })

export const getConsumerUnitsByClient = (clientId: string) =>
  pb
    .collection('consumer_units')
    .getFullList({ filter: `clientId = "${clientId}"`, sort: '-created' })

export const createConsumerUnit = (data: any) => pb.collection('consumer_units').create(data)
export const updateConsumerUnit = (id: string, data: any) =>
  pb.collection('consumer_units').update(id, data)
export const deleteConsumerUnit = (id: string) => pb.collection('consumer_units').delete(id)
