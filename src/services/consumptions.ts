import pb from '@/lib/pocketbase/client'

export const getConsumptions = () =>
  pb.collection('consumptions').getFullList({ sort: '-created', expand: 'clientId' })

export const createConsumption = (data: {
  month: string
  consumo: number
  creditos: number
  clientId: string
}) => pb.collection('consumptions').create(data)

export const updateConsumption = (
  id: string,
  data: Partial<{ month: string; consumo: number; creditos: number; clientId: string }>,
) => pb.collection('consumptions').update(id, data)

export const deleteConsumption = (id: string) => pb.collection('consumptions').delete(id)
