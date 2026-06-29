import pb from '@/lib/pocketbase/client'

export const getPlantDocuments = () =>
  pb.collection('plant_documents').getFullList({ sort: '-created', expand: 'plantId,uploadedBy' })

export const createPlantDocument = (data: FormData) => pb.collection('plant_documents').create(data)
export const deletePlantDocument = (id: string) => pb.collection('plant_documents').delete(id)
