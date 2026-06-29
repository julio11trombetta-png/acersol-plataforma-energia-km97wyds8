import pb from '@/lib/pocketbase/client'

export const getKnowledgeBase = () =>
  pb.collection('knowledge_base').getFullList({ sort: '-created' })

export const createKnowledgeItem = (data: any) => pb.collection('knowledge_base').create(data)
export const updateKnowledgeItem = (id: string, data: any) =>
  pb.collection('knowledge_base').update(id, data)
export const deleteKnowledgeItem = (id: string) => pb.collection('knowledge_base').delete(id)
