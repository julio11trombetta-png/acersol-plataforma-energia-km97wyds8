routerAdd(
  'POST',
  '/backend/v1/audit/reauth',
  (e) => {
    const body = e.requestInfo().body || {}
    const userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')

    var password = body.password || ''
    if (!password) return e.badRequestError('password is required')

    var user = $app.findRecordById('_pb_users_auth_', userId)
    if (!user.validatePassword(password)) {
      return e.badRequestError('Senha incorreta')
    }

    return e.json(200, { success: true })
  },
  $apis.requireAuth(),
)
