import pb from '@/lib/pocketbase/client'

export const getPlantGenerations = () =>
  pb.collection('plant_generation').getFullList({ sort: '-created', expand: 'plantId' })

export const createPlantGeneration = (data: {
  month: string
  generation: number
  plantId: string
  repasse_amount?: number
  status?: string
  injetada?: number
  consumo_proprio?: number
  perdas?: number
  observacoes?: string
}) => pb.collection('plant_generation').create(data)

export const updatePlantGeneration = (
  id: string,
  data: Partial<{
    month: string
    generation: number
    plantId: string
    repasse_amount: number
    status: string
    injetada: number
    consumo_proprio: number
    perdas: number
    observacoes: string
  }>,
) => pb.collection('plant_generation').update(id, data)

export const deletePlantGeneration = (id: string) => pb.collection('plant_generation').delete(id)
export const getPlantGenerationsByPlant = (plantId: string) =>
  pb
    .collection('plant_generation')
    .getFullList({ sort: '-created', expand: 'plantId', filter: `plantId = "${plantId}"` })
