migrate(
  (app) => {
    var uId = '_pb_users_auth_'
    var ar = "@request.auth.id != ''"
    var am = "@request.auth.id != '' && @request.auth.role = 'admin'"

    app.save(
      new Collection({
        name: 'permission_groups',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: null,
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'description', type: 'text' },
          { name: 'permissions', type: 'json' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_pgroups_name ON permission_groups (name)'],
      }),
    )

    app.save(
      new Collection({
        name: 'user_permissions',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: null,
        fields: [
          { name: 'userId', type: 'relation', collectionId: uId, maxSelect: 1, required: true },
          { name: 'permissions', type: 'json' },
          {
            name: 'groupIds',
            type: 'relation',
            collectionId: app.findCollectionByNameOrId('permission_groups').id,
            maxSelect: 20,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_uperm_user ON user_permissions (userId)'],
      }),
    )

    app.save(
      new Collection({
        name: 'user_sessions',
        type: 'base',
        listRule: am,
        viewRule: am,
        createRule: ar,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'userId', type: 'relation', collectionId: uId, maxSelect: 1, required: true },
          { name: 'session_token', type: 'text', required: true },
          { name: 'ip_address', type: 'text' },
          { name: 'browser', type: 'text' },
          { name: 'os', type: 'text' },
          { name: 'device', type: 'text' },
          { name: 'city', type: 'text' },
          { name: 'login_at', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'logout_at', type: 'date' },
          { name: 'duration_seconds', type: 'number' },
          {
            name: 'status',
            type: 'select',
            values: ['Ativa', 'Encerrada', 'Expirada'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_sessions_user ON user_sessions (userId)',
          'CREATE INDEX idx_sessions_status ON user_sessions (status)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'login_history',
        type: 'base',
        listRule: am,
        viewRule: am,
        createRule: ar,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'userId', type: 'relation', collectionId: uId, maxSelect: 1 },
          { name: 'email', type: 'text' },
          { name: 'success', type: 'bool' },
          { name: 'failure_reason', type: 'text' },
          { name: 'ip_address', type: 'text' },
          { name: 'browser', type: 'text' },
          { name: 'os', type: 'text' },
          { name: 'device', type: 'text' },
          { name: 'attempt_count', type: 'number' },
          { name: 'locked', type: 'bool' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_login_hist_user ON login_history (userId)'],
      }),
    )

    var softDeleteCols = [
      'clients',
      'plants',
      'contracts',
      'invoices',
      'crm_leads',
      'tickets',
      'plant_generation',
      'consumptions',
      'associate_documents',
      'plant_documents',
      'assemblies',
      'news',
      'blog_posts',
      'cash_flow',
      'bank_accounts',
    ]
    for (var i = 0; i < softDeleteCols.length; i++) {
      try {
        var col = app.findCollectionByNameOrId(softDeleteCols[i])
        if (!col.fields.getByName('deleted_at')) {
          col.fields.add(new DateField({ name: 'deleted_at' }))
        }
        app.save(col)
      } catch (_) {}
    }

    try {
      var usersCol = app.findCollectionByNameOrId(uId)
      if (!usersCol.fields.getByName('login_attempts')) {
        usersCol.fields.add(new NumberField({ name: 'login_attempts' }))
      }
      if (!usersCol.fields.getByName('locked_until')) {
        usersCol.fields.add(new DateField({ name: 'locked_until' }))
      }
      if (!usersCol.fields.getByName('last_login')) {
        usersCol.fields.add(new DateField({ name: 'last_login' }))
      }
      app.save(usersCol)
    } catch (_) {}
  },
  (app) => {
    var cols = ['permission_groups', 'user_permissions', 'user_sessions', 'login_history']
    for (var i = 0; i < cols.length; i++) {
      try {
        app.delete(app.findCollectionByNameOrId(cols[i]))
      } catch (_) {}
    }
    var softDeleteCols = [
      'clients',
      'plants',
      'contracts',
      'invoices',
      'crm_leads',
      'tickets',
      'plant_generation',
      'consumptions',
      'associate_documents',
      'plant_documents',
      'assemblies',
      'news',
      'blog_posts',
      'cash_flow',
      'bank_accounts',
    ]
    for (var j = 0; j < softDeleteCols.length; j++) {
      try {
        var col = app.findCollectionByNameOrId(softDeleteCols[j])
        var f = col.fields.getByName('deleted_at')
        if (f) col.fields.removeById(f.getId())
        app.save(col)
      } catch (_) {}
    }
  },
)
