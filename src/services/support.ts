import pb from '@/lib/pocketbase/client'

export const getTickets = () =>
  pb.collection('tickets').getFullList({ sort: '-created', expand: 'clientId' })
export const createTicket = (data: any) => pb.collection('tickets').create(data)
export const updateTicket = (id: string, data: any) => pb.collection('tickets').update(id, data)
export const deleteTicket = (id: string) => pb.collection('tickets').delete(id)
export const getKnowledgeBase = () =>
  pb.collection('knowledge_base').getFullList({ sort: '-created' })
