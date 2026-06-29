import pb from '@/lib/pocketbase/client'

export const getActivityLogs = (page = 1, perPage = 20) =>
  pb.collection('activity_logs').getList(page, perPage, { sort: '-created', expand: 'userId' })

export const createActivityLog = (data: {
  action: string
  entity?: string
  entityId?: string
  details?: string
}) => {
  const user = pb.authStore.record
  return pb.collection('activity_logs').create({ ...data, userId: user?.id || '' })
}
