import pb from '@/lib/pocketbase/client'

export async function searchRecords(
  collection: string,
  searchFields: string[],
  query: string,
  limit = 10,
) {
  const q = query.trim()
  if (!q) {
    const res = await pb.collection(collection).getList(1, limit, { sort: '-created' })
    return res.items as any[]
  }
  const escaped = q.replace(/"/g, '\\"')
  const filter = searchFields.map((f) => `${f} ~ "${escaped}"`).join(' || ')
  const res = await pb.collection(collection).getList(1, limit, { filter, sort: '-created' })
  return res.items as any[]
}

export async function getRecordById(collection: string, id: string) {
  return (await pb.collection(collection).getOne(id)) as any
}

export async function findClientByDocument(document: string) {
  const digits = document.replace(/\D/g, '')
  const filter = `document_number = "${document}" || document_number = "${digits}"`
  try {
    return await pb.collection('clients').getFirstListItem(filter)
  } catch {
    return null
  }
}
