import pb from '@/lib/pocketbase/client'

export const getDocumentVersions = (recordId: string) =>
  pb.collection('document_versions').getFullList({
    filter: `record_id = "${recordId}"`,
    sort: '-version_number',
    expand: 'uploaded_by',
  })

export const getDocumentVersionsByCollection = (collection: string, recordId: string) =>
  pb.collection('document_versions').getFullList({
    filter: `collection_name = "${collection}" && record_id = "${recordId}"`,
    sort: '-version_number',
    expand: 'uploaded_by',
  })
