import pb from '@/lib/pocketbase/client'

export const getCrmTasks = (leadId?: string) =>
  pb.collection('crm_tasks').getFullList({
    sort: '-created',
    filter: leadId ? `leadId = "${leadId}"` : '',
  })

export const createCrmTask = (data: any) => pb.collection('crm_tasks').create(data)
export const updateCrmTask = (id: string, data: any) => pb.collection('crm_tasks').update(id, data)
export const deleteCrmTask = (id: string) => pb.collection('crm_tasks').delete(id)
