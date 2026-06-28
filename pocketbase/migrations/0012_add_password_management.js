migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol.fields.getByName('force_password_change')) {
      usersCol.fields.add(new BoolField({ name: 'force_password_change' }))
    }
    app.save(usersCol)

    const logsCol = new Collection({
      name: 'password_management_logs',
      type: 'base',
      listRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      viewRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'admin_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        {
          name: 'target_user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'action_type', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_password_logs_target ON password_management_logs (target_user_id)',
        'CREATE INDEX idx_password_logs_created ON password_management_logs (created DESC)',
      ],
    })
    app.save(logsCol)
  },
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const field = usersCol.fields.getByName('force_password_change')
    if (field) {
      usersCol.fields.remove(field)
      app.save(usersCol)
    }
    try {
      const logsCol = app.findCollectionByNameOrId('password_management_logs')
      app.delete(logsCol)
    } catch (_) {}
  },
)
