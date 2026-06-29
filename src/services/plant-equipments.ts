import pb from '@/lib/pocketbase/client'

export const getPlantEquipments = (typeFilter?: string) => {
  const filter = typeFilter ? `type = "${typeFilter}"` : undefined
  return pb
    .collection('plant_equipments')
    .getFullList({ sort: '-created', expand: 'plantId', filter })
}

export const createPlantEquipment = (data: any) => pb.collection('plant_equipments').create(data)
export const updatePlantEquipment = (id: string, data: any) =>
  pb.collection('plant_equipments').update(id, data)
export const deletePlantEquipment = (id: string) => pb.collection('plant_equipments').delete(id)
