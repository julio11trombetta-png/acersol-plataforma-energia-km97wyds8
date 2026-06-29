import pb from '@/lib/pocketbase/client'

export const getApprovals = (status = 'pending') =>
  pb.send(`/backend/v1/approvals?status=${status}`, { method: 'GET' })

export const createApprovalRequest = (data: {
  collection_name: string
  record_id: string
  operation_type: string
  description?: string
  justification?: string
  payload?: Record<string, unknown>
  expires_at?: string
}) =>
  pb.send('/backend/v1/approvals', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

export const approveRequest = (id: string, notes?: string) =>
  pb.send(`/backend/v1/approvals/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ notes: notes || '' }),
    headers: { 'Content-Type': 'application/json' },
  })

export const rejectRequest = (id: string, notes?: string) =>
  pb.send(`/backend/v1/approvals/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ notes: notes || '' }),
    headers: { 'Content-Type': 'application/json' },
  })
