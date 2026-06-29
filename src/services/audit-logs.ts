import pb from '@/lib/pocketbase/client'

export const getAuditLogs = (page = 1, perPage = 20) =>
  pb.collection('audit_logs').getList(page, perPage, { sort: '-created', expand: 'userId' })

export const getAuditLogsByRecord = (recordId: string, page = 1, perPage = 50) =>
  pb.collection('audit_logs').getList(page, perPage, {
    sort: '-created',
    filter: `record_id = "${recordId}"`,
    expand: 'userId',
  })

export const getAuditLogsByCollection = (collection: string, page = 1, perPage = 20) =>
  pb.collection('audit_logs').getList(page, perPage, {
    sort: '-created',
    filter: `collection_name = "${collection}"`,
    expand: 'userId',
  })

export const searchAuditLogs = (query: string, page = 1, perPage = 20) =>
  pb.collection('audit_logs').getList(page, perPage, {
    sort: '-created',
    filter: `protocol ~ "${query}" || record_friendly_code ~ "${query}" || record_uuid ~ "${query}" || user_name ~ "${query}"`,
    expand: 'userId',
  })

export const createAuditLog = (data: {
  protocol: string
  operation_type: string
  module: string
  collection_name: string
  record_id: string
  record_uuid?: string
  record_friendly_code?: string
  field_changes?: string
  ip_address?: string
  browser?: string
  os?: string
  device?: string
}) => {
  const user = pb.authStore.record
  return pb.collection('audit_logs').create({
    ...data,
    userId: user?.id || '',
    user_name: user?.name || user?.email || '',
    user_profile: (user as any)?.role || '',
  })
}
