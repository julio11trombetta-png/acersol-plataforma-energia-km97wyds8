import pb from '@/lib/pocketbase/client'

export const getSecurityAlerts = (status?: string) =>
  pb.collection('security_alerts').getFullList({
    filter: status ? `status = "${status}"` : '',
    sort: '-created',
    expand: 'userId,resolved_by',
  })

export const resolveSecurityAlert = (id: string, notes: string) => {
  const user = pb.authStore.record
  return pb.collection('security_alerts').update(id, {
    status: 'resolved',
    resolved_by: user?.id || '',
    resolved_at: new Date().toISOString(),
    resolution_notes: notes,
  })
}

export const dismissSecurityAlert = (id: string, notes: string) => {
  const user = pb.authStore.record
  return pb.collection('security_alerts').update(id, {
    status: 'dismissed',
    resolved_by: user?.id || '',
    resolved_at: new Date().toISOString(),
    resolution_notes: notes,
  })
}
