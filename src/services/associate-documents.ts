import pb from '@/lib/pocketbase/client'

export const getAssociateDocuments = () =>
  pb
    .collection('associate_documents')
    .getFullList({ sort: '-created', expand: 'clientId,uploadedBy' })

export const getDocumentsByClient = (clientId: string) =>
  pb
    .collection('associate_documents')
    .getFullList({ filter: `clientId = "${clientId}"`, sort: '-created', expand: 'uploadedBy' })

export const createAssociateDocument = (data: FormData) =>
  pb.collection('associate_documents').create(data)
export const deleteAssociateDocument = (id: string) =>
  pb.collection('associate_documents').delete(id)
