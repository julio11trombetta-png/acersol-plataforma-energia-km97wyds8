migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'juliotrombetta@acersol.com.br')
      record.setPassword('Acer@2026')
      record.setVerified(true)
      record.set('name', 'Julio Trombetta')
      record.set('role', 'admin')
      app.save(record)
    } catch (_) {
      const record = new Record(col)
      record.setEmail('juliotrombetta@acersol.com.br')
      record.setPassword('Acer@2026')
      record.setVerified(true)
      record.set('name', 'Julio Trombetta')
      record.set('role', 'admin')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'juliotrombetta@acersol.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
