import pb from '@/lib/pocketbase/client'

export const getOccurrences = () =>
  pb.collection('occurrences').getFullList({ sort: '-created', expand: 'clientId,userId' })

export const getOccurrencesByClient = (clientId: string) =>
  pb
    .collection('occurrences')
    .getFullList({ filter: `clientId = "${clientId}"`, sort: '-created', expand: 'userId' })

export const createOccurrence = (data: any) => pb.collection('occurrences').create(data)
export const updateOccurrence = (id: string, data: any) =>
  pb.collection('occurrences').update(id, data)
export const deleteOccurrence = (id: string) => pb.collection('occurrences').delete(id)
