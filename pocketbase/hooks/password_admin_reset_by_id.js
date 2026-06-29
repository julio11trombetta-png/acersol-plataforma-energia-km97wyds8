routerAdd(
  'POST',
  '/backend/v1/password/admin-reset-by-id',
  (e) => {
    if (!e.auth || e.auth.getString('role') !== 'admin') {
      return e.forbiddenError('Acesso restrito a administradores')
    }
    var body = e.requestInfo().body || {}
    var userId = body.user_id || ''
    if (!userId) return e.badRequestError('user_id is required')

    var user
    try {
      user = $app.findRecordById('_pb_users_auth_', userId)
    } catch (_) {
      return e.notFoundError('Usuário não encontrado')
    }

    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
    var newPass = ''
    for (var i = 0; i < 12; i++) {
      newPass += chars[Math.floor(Math.random() * chars.length)]
    }

    user.setPassword(newPass)
    user.set('force_password_change', true)
    $app.save(user)

    var logsCol = $app.findCollectionByNameOrId('password_management_logs')
    var log = new Record(logsCol)
    log.set('admin_id', e.auth.id)
    log.set('target_user_id', user.id)
    log.set('action_type', 'Manual Reset to Random')
    $app.save(log)

    return e.json(200, { success: true, temporary_password: newPass })
  },
  $apis.requireAuth(),
)
