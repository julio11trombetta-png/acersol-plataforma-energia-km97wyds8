import pb from '@/lib/pocketbase/client'

export const getPasswordLogs = (page = 1, perPage = 20) =>
  pb.collection('password_management_logs').getList(page, perPage, {
    sort: '-created',
    expand: 'admin_id,target_user_id',
  })

export const getPasswordLogsByUser = (userId: string, page = 1, perPage = 20) =>
  pb.collection('password_management_logs').getList(page, perPage, {
    sort: '-created',
    filter: `target_user_id = "${userId}"`,
    expand: 'admin_id,target_user_id',
  })
