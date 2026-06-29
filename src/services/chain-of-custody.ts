import pb from '@/lib/pocketbase/client'

export const getChainOfCustody = (recordId: string) =>
  pb.collection('chain_of_custody').getFullList({
    filter: `record_id = "${recordId}"`,
    sort: '-created',
    expand: 'userId',
  })

export const createCustodyEntry = (data: {
  collection_name: string
  record_id: string
  field_name?: string
  operation:
    | 'created'
    | 'viewed'
    | 'downloaded'
    | 'printed'
    | 'sent'
    | 'signed'
    | 'cancelled'
    | 'archived'
  details?: string
}) => {
  const user = pb.authStore.record
  return pb.collection('chain_of_custody').create({
    ...data,
    userId: user?.id || '',
    user_name: user?.name || user?.email || '',
    ip_address: '',
    browser: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  })
}
