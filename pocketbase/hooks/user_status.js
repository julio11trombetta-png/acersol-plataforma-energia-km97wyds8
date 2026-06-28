routerAdd(
  'GET',
  '/backend/v1/user-status/{document}',
  (e) => {
    if (!e.auth || e.auth.getString('role') !== 'admin') {
      return e.forbiddenError('Acesso restrito a administradores')
    }

    const document = e.request.pathValue('document') || ''
    const digits = document.replace(/\D/g, '')
    if (digits.length !== 11 && digits.length !== 14) {
      return e.badRequestError('Documento inválido')
    }

    let user
    try {
      user = $app.findFirstRecordByData('_pb_users_auth_', 'username', digits)
    } catch (_) {
      return e.json(200, { exists: false })
    }

    return e.json(200, {
      exists: true,
      id: user.id,
      name: user.getString('name'),
      email: user.getString('email'),
      role: user.getString('role'),
      force_password_change: user.getBool('force_password_change'),
    })
  },
  $apis.requireAuth(),
)
