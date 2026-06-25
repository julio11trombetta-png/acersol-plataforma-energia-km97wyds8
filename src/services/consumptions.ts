import pb from '@/lib/pocketbase/client'

export const getConsumptions = () => pb.collection('consumptions').getFullList({ sort: 'created' })
