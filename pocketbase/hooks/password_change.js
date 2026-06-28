routerAdd(
  'POST',
  '/backend/v1/password/change',
  (e) => {
    const body = e.requestInfo().body || {}
    const userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')

    const oldPassword = body.old_password || ''
    const newPassword = body.new_password || ''

    if (!newPassword || newPassword.length < 8) {
      return e.badRequestError('A senha deve ter no mínimo 8 caracteres')
    }

    if (oldPassword === newPassword) {
      return e.badRequestError('A nova senha deve ser diferente da atual')
    }

    const user = $app.findRecordById('_pb_users_auth_', userId)

    if (!user.validatePassword(oldPassword)) {
      return e.badRequestError('Senha atual incorreta')
    }

    user.setPassword(newPassword)
    user.set('force_password_change', false)
    $app.save(user)

    return e.json(200, { success: true })
  },
  $apis.requireAuth(),
)
