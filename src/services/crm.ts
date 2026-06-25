import pb from '@/lib/pocketbase/client'

export const getCrmLeads = () => pb.collection('crm_leads').getFullList({ sort: '-created' })
export const createCrmLead = (data: any) => pb.collection('crm_leads').create(data)
export const updateCrmLead = (id: string, data: any) => pb.collection('crm_leads').update(id, data)
export const deleteCrmLead = (id: string) => pb.collection('crm_leads').delete(id)
