routerAdd(
  'POST',
  '/backend/v1/password/admin-force',
  (e) => {
    const body = e.requestInfo().body || {}
    const adminId = e.auth ? e.auth.id : ''

    if (!e.auth || e.auth.getString('role') !== 'admin') {
      return e.forbiddenError('Acesso restrito a administradores')
    }

    const documentNumber = body.document_number || ''
    if (!documentNumber) return e.badRequestError('document_number is required')

    const digits = documentNumber.replace(/\D/g, '')
    if (digits.length !== 11 && digits.length !== 14) {
      return e.badRequestError('Documento inválido')
    }

    let user
    try {
      user = $app.findFirstRecordByData('_pb_users_auth_', 'username', digits)
    } catch (_) {
      return e.notFoundError('Usuário não encontrado para este documento')
    }

    const value = body.value !== false
    user.set('force_password_change', value)
    $app.save(user)

    const logsCol = $app.findCollectionByNameOrId('password_management_logs')
    const log = new Record(logsCol)
    log.set('admin_id', adminId)
    log.set('target_user_id', user.id)
    log.set('action_type', value ? 'Forced Change Flag Set' : 'Forced Change Flag Removed')
    $app.save(log)

    return e.json(200, { success: true })
  },
  $apis.requireAuth(),
)
