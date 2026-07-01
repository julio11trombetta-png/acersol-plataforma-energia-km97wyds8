import pb from '@/lib/pocketbase/client'

export interface InstitutionalAsset {
  id: string
  title: string
  category: 'plant' | 'panels' | 'industry' | 'nature'
  file?: string
  url?: string
  active: boolean
}

export const getInstitutionalAssets = (activeOnly = true) => {
  const opts: any = { sort: 'created' }
  if (activeOnly) opts.filter = 'active = true'
  return pb.collection('institutional_assets').getFullList(opts)
}

export const getAssetsByCategory = (category: string) =>
  pb.collection('institutional_assets').getFullList({
    filter: `category = "${category}" && active = true`,
    sort: 'created',
  })

export const createInstitutionalAsset = (data: any) =>
  pb.collection('institutional_assets').create(data)

export const updateInstitutionalAsset = (id: string, data: any) =>
  pb.collection('institutional_assets').update(id, data)

export const deleteInstitutionalAsset = (id: string) =>
  pb.collection('institutional_assets').delete(id)
