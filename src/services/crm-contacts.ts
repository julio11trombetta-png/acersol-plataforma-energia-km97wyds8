import pb from '@/lib/pocketbase/client'

export const getCrmContacts = (leadId?: string) =>
  pb.collection('crm_contacts').getFullList({
    sort: '-created',
    filter: leadId ? `leadId = "${leadId}"` : '',
  })

export const createCrmContact = (data: any) => pb.collection('crm_contacts').create(data)
export const updateCrmContact = (id: string, data: any) =>
  pb.collection('crm_contacts').update(id, data)
export const deleteCrmContact = (id: string) => pb.collection('crm_contacts').delete(id)
