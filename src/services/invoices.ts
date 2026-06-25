import pb from '@/lib/pocketbase/client'

export const getInvoices = () => pb.collection('invoices').getFullList({ sort: '-created' })
