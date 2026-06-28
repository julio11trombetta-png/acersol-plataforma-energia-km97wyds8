migrate(
  (app) => {
    const clientsCol = app.findCollectionByNameOrId('clients')
    const newFieldNames = ['cnpj', 'cpf', 'phone', 'email', 'address']
    for (const name of newFieldNames) {
      if (!clientsCol.fields.getByName(name)) {
        clientsCol.fields.add(new TextField({ name: name }))
      }
    }
    app.save(clientsCol)

    const plantsCol = app.findCollectionByNameOrId('plants')
    for (const name of newFieldNames) {
      if (!plantsCol.fields.getByName(name)) {
        plantsCol.fields.add(new TextField({ name: name }))
      }
    }
    app.save(plantsCol)

    const testAdminEmails = ['admin@acersol.com', 'julio11trombetta@gmail.com']
    for (const email of testAdminEmails) {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(record)
      } catch (_) {}
    }
  },
  (app) => {
    const fieldsToRemove = ['cnpj', 'cpf', 'phone', 'email', 'address']

    const clientsCol = app.findCollectionByNameOrId('clients')
    for (const name of fieldsToRemove) {
      const field = clientsCol.fields.getByName(name)
      if (field) clientsCol.fields.remove(field)
    }
    app.save(clientsCol)

    const plantsCol = app.findCollectionByNameOrId('plants')
    for (const name of fieldsToRemove) {
      const field = plantsCol.fields.getByName(name)
      if (field) plantsCol.fields.remove(field)
    }
    app.save(plantsCol)
  },
)
