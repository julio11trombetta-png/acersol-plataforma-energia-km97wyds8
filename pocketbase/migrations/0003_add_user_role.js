migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!col.fields.getByName('role')) {
      col.fields.add(
        new SelectField({
          name: 'role',
          values: ['client', 'owner', 'admin'],
          maxSelect: 1,
        }),
      )
    }
    app.save(col)

    const seedUsers = [
      { email: 'admin@acersol.com', name: 'Administrador ACERSOL', role: 'admin' },
      { email: 'cliente@acersol.com', name: 'Cliente João Silva', role: 'client' },
      { email: 'usina@acersol.com', name: 'Proprietário Usina Norte', role: 'owner' },
      { email: 'julio11trombetta@gmail.com', name: 'Admin Julio', role: 'admin' },
    ]

    for (const u of seedUsers) {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
      } catch (_) {
        const record = new Record(col)
        record.setEmail(u.email)
        record.setPassword('Skip@Pass')
        record.setVerified(true)
        record.set('name', u.name)
        record.set('role', u.role)
        app.save(record)
      }
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    const field = col.fields.getByName('role')
    if (field) {
      col.fields.remove(field)
      app.save(col)
    }
  },
)
