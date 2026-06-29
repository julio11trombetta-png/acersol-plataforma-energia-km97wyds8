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

export const getPlantsAdvanced = async (opts: {
  search?: string
  status?: string
  utility?: string
  state?: string
  perPage?: number
}) => {
  const filters: string[] = []
  if (opts.search) {
    filters.push(
      `(name ~ "${opts.search}" || location ~ "${opts.search}" || city ~ "${opts.search}" || codigo_interno ~ "${opts.search}")`,
    )
  }
  if (opts.status && opts.status !== 'all') filters.push(`status = "${opts.status}"`)
  if (opts.utility && opts.utility !== 'all') filters.push(`utilityProvider = "${opts.utility}"`)
  if (opts.state && opts.state !== 'all') filters.push(`state = "${opts.state}"`)
  const filter = filters.join(' && ')
  return pb.collection('plants').getList(1, opts.perPage || 50, {
    sort: '-created',
    filter: filter || undefined,
  })
}
