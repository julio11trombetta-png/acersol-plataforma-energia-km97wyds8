import pb from '@/lib/pocketbase/client'

export const getActiveSessions = () =>
  pb.collection('user_sessions').getFullList({
    filter: 'status = "Ativa"',
    sort: '-login_at',
    expand: 'userId',
  })

export const getUserSessions = (userId: string, page = 1, perPage = 20) =>
  pb.collection('user_sessions').getList(page, perPage, {
    filter: `userId = "${userId}"`,
    sort: '-login_at',
  })

export const revokeSession = (id: string) =>
  pb.collection('user_sessions').update(id, {
    status: 'Encerrada',
    logout_at: new Date().toISOString(),
  })

export const getLoginHistory = (page = 1, perPage = 20) =>
  pb.collection('login_history').getList(page, perPage, {
    sort: '-created',
    expand: 'userId',
  })

export const getLoginHistoryByUser = (userId: string, page = 1, perPage = 20) =>
  pb.collection('login_history').getList(page, perPage, {
    filter: `userId = "${userId}"`,
    sort: '-created',
  })

export const checkReauth = (password: string) =>
  pb.send('/backend/v1/audit/reauth', {
    method: 'POST',
    body: JSON.stringify({ password }),
    headers: { 'Content-Type': 'application/json' },
  })
