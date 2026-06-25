import pb from '@/lib/pocketbase/client'

export const getPlants = (page = 1, search = '') => {
  const filter = search ? `name ~ "${search}" || location ~ "${search}"` : ''
  return pb.collection('plants').getList(page, 20, { sort: '-created', filter })
}
export const createPlant = (data: any) => pb.collection('plants').create(data)
export const updatePlant = (id: string, data: any) => pb.collection('plants').update(id, data)
export const deletePlant = (id: string) => pb.collection('plants').delete(id)
