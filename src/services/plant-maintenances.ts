import pb from '@/lib/pocketbase/client'

export const getPlantMaintenances = () =>
  pb.collection('plant_maintenances').getFullList({ sort: '-date', expand: 'plantId' })

export const createPlantMaintenance = (data: any) =>
  pb.collection('plant_maintenances').create(data)
export const updatePlantMaintenance = (id: string, data: any) =>
  pb.collection('plant_maintenances').update(id, data)
export const deletePlantMaintenance = (id: string) => pb.collection('plant_maintenances').delete(id)
