import pb from '@/lib/pocketbase/client'

export async function logAuditAction(params: {
  operation_type: string
  module: string
  screen: string
  collection_name: string
  record_id: string
  record_uuid?: string
  record_friendly_code?: string
  justification?: string
  classification_level?: string
}) {
  const user = pb.authStore.record
  if (!user) return
  const { classifyOperation } = await import('@/lib/audit-classification')
  const level = params.classification_level || classifyOperation(params.operation_type)
  const now = new Date()
  const ds = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const ts = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  let logCount = 0
  try {
    const existing = await pb
      .collection('audit_logs')
      .getList(1, 1, { filter: `protocol ~ "LOG-${ds}"` })
    logCount = existing.totalItems
  } catch {
    /* intentionally ignored */
  }
  const protocol = `LOG-${ds}-${ts}-${String(logCount + 1).padStart(6, '0')}`
  try {
    await pb.collection('audit_logs').create({
      protocol,
      userId: user.id,
      user_name: (user as any).name || (user as any).email || '',
      user_profile: (user as any).role || '',
      module: params.module,
      screen: params.screen,
      collection_name: params.collection_name,
      record_id: params.record_id,
      record_uuid: params.record_uuid || '',
      record_friendly_code: params.record_friendly_code || '',
      operation_type: params.operation_type,
      field_changes: JSON.stringify({}),
      justification: params.justification || '',
      classification_level: level,
    })
  } catch {
    /* intentionally ignored */
  }
}
