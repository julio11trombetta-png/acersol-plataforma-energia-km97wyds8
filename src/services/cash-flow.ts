import pb from '@/lib/pocketbase/client'

export const getCashFlow = () => pb.collection('cash_flow').getFullList({ sort: '-date' })

export const createCashFlow = (data: {
  type: string
  amount: number
  description?: string
  date?: string
  category?: string
}) => pb.collection('cash_flow').create(data)

export const updateCashFlow = (id: string, data: any) => pb.collection('cash_flow').update(id, data)

export const deleteCashFlow = (id: string) => pb.collection('cash_flow').delete(id)
