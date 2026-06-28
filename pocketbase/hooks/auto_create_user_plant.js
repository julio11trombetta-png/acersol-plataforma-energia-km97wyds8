onRecordAfterCreateSuccess((e) => {
  const doc = e.record.getString('document_number')
  if (!doc) return e.next()

  const digits = doc.replace(/\D/g, '')
  if (digits.length !== 11 && digits.length !== 14) return e.next()

  try {
    $app.findFirstRecordByData('_pb_users_auth_', 'username', digits)
    return e.next()
  } catch (_) {}

  try {
    const usersCol = $app.findCollectionByNameOrId('_pb_users_auth_')
    const record = new Record(usersCol)
    record.set('username', digits)
    record.setPassword(digits)
    record.setVerified(true)
    record.set('role', 'owner')
    record.set('force_password_change', true)
    $app.save(record)
  } catch (err) {
    console.log('Failed to auto-create user for plant ' + e.record.id + ': ' + err.message)
  }

  return e.next()
}, 'plants')
