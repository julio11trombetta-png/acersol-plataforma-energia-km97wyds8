import pb from '@/lib/pocketbase/client'

export const changePassword = (oldPassword: string, newPassword: string) =>
  pb.send('/backend/v1/password/change', {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    headers: { 'Content-Type': 'application/json' },
  })

export const adminResetPassword = (documentNumber: string) =>
  pb.send('/backend/v1/password/admin-reset', {
    method: 'POST',
    body: JSON.stringify({ document_number: documentNumber }),
    headers: { 'Content-Type': 'application/json' },
  })

export const adminForcePasswordChange = (documentNumber: string, value = true) =>
  pb.send('/backend/v1/password/admin-force', {
    method: 'POST',
    body: JSON.stringify({ document_number: documentNumber, value }),
    headers: { 'Content-Type': 'application/json' },
  })
