import pb from '@/lib/pocketbase/client'

export const getAssemblies = () => pb.collection('assemblies').getFullList({ sort: '-created' })
export const createAssembly = (data: any) => pb.collection('assemblies').create(data)
export const updateAssembly = (id: string, data: any) =>
  pb.collection('assemblies').update(id, data)
export const deleteAssembly = (id: string) => pb.collection('assemblies').delete(id)
