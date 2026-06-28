import pb from '@/lib/pocketbase/client'

export const getPlants = (page = 1, search = '') => {
  const filter = search ? `name ~ "${search}" || location ~ "${search}"` : ''
  return pb.collection('plants').getList(page, 20, { sort: '-created', filter })
}
export const createPlant = (data: any) => pb.collection('plants').create(data)
export const updatePlant = (id: string, data: any) => pb.collection('plants').update(id, data)
export const deletePlant = (id: string) => pb.collection('plants').delete(id)

export const getAllPlants = () => pb.collection('plants').getFullList({ sort: 'name' })
export const getPlantsByDocument = (document: string) =>
  pb
    .collection('plants')
    .getFullList({ filter: `document_number = "${document}"`, sort: '-created' })
export const getPlantById = (id: string) => pb.collection('plants').getOne(id)

export const checkDocumentExists = async (document: string, excludeId?: string) => {
  try {
    const filter = excludeId
      ? `document_number = "${document}" && id != "${excludeId}"`
      : `document_number = "${document}"`
    const [clientResults, plantResults] = await Promise.all([
      pb.collection('clients').getList(1, 1, { filter }),
      pb.collection('plants').getList(1, 1, { filter }),
    ])
    return clientResults.items.length > 0 || plantResults.items.length > 0
  } catch {
    return false
  }
}
