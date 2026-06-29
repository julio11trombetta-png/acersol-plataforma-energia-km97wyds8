import pb from '@/lib/pocketbase/client'

export interface CollaboratorFormData {
  name: string
  email: string
  cpf: string
  rg: string
  birth_date: string
  phone: string
  whatsapp: string
  position: string
  position_custom: string
  department: string
  department_custom: string
  employee_type: string
  notes: string
  role: string
  username: string
  password: string
  force_password_change: boolean
  status: string
}

export function generateTempPassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export const getCollaborators = () =>
  pb.collection('users').getFullList({
    filter: "role = 'employee' || role = 'admin'",
    sort: '-created',
  })

export const createCollaborator = (data: Record<string, unknown>) =>
  pb.collection('users').create(data)

export const updateCollaborator = (id: string, data: Record<string, unknown>) =>
  pb.collection('users').update(id, data)

export const deleteCollaborator = (id: string) => pb.collection('users').delete(id)

export const resetPasswordById = (userId: string) =>
  pb.send('/backend/v1/password/admin-reset-by-id', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
    headers: { 'Content-Type': 'application/json' },
  })

export const toggleBlockUser = (id: string, block: boolean) =>
  pb.collection('users').update(id, {
    active: !block,
    status: block ? 'Inativo' : 'Ativo',
  })

export const deactivateUser = (id: string) =>
  pb.collection('users').update(id, {
    status: 'Desligado',
    active: false,
  })

export const softDeleteUser = (id: string) =>
  pb.collection('users').update(id, {
    active: false,
    deleted_at: new Date().toISOString(),
  })

export async function checkUserHasHistory(id: string): Promise<boolean> {
  try {
    const [logs, sessions, logins] = await Promise.all([
      pb
        .collection('activity_logs')
        .getList(1, 1, { filter: `userId = "${id}"` })
        .catch(() => ({ totalItems: 0 })),
      pb
        .collection('user_sessions')
        .getList(1, 1, { filter: `userId = "${id}"` })
        .catch(() => ({ totalItems: 0 })),
      pb
        .collection('login_history')
        .getList(1, 1, { filter: `userId = "${id}"` })
        .catch(() => ({ totalItems: 0 })),
    ])
    return (
      (logs.totalItems || 0) > 0 || (sessions.totalItems || 0) > 0 || (logins.totalItems || 0) > 0
    )
  } catch {
    return true
  }
}
