import pb from '@/lib/pocketbase/client'

export const getInvoices = () =>
  pb.collection('invoices').getFullList({ sort: '-created', expand: 'clientId' })

export const createInvoice = (data: {
  month: string
  amount: number
  status: string
  clientId: string
}) => pb.collection('invoices').create(data)

export const updateInvoice = (
  id: string,
  data: Partial<{ month: string; amount: number; status: string; clientId: string }>,
) => pb.collection('invoices').update(id, data)

export const deleteInvoice = (id: string) => pb.collection('invoices').delete(id)
export const getInvoicesByClient = (clientId: string) =>
  pb
    .collection('invoices')
    .getFullList({ sort: '-created', expand: 'clientId', filter: `clientId = "${clientId}"` })
