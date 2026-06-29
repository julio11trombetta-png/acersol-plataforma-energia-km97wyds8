migrate(
  (app) => {
    var uId = '_pb_users_auth_'
    var usersCol = app.findCollectionByNameOrId(uId)

    var roleField = usersCol.fields.getByName('role')
    if (roleField) {
      usersCol.fields.removeById(roleField.getId())
    }
    usersCol.fields.add(
      new SelectField({
        name: 'role',
        values: ['client', 'owner', 'admin', 'employee', 'distributor'],
        maxSelect: 1,
      }),
    )

    if (!usersCol.fields.getByName('employee_type')) {
      usersCol.fields.add(new TextField({ name: 'employee_type' }))
    }
    if (!usersCol.fields.getByName('department')) {
      usersCol.fields.add(
        new SelectField({
          name: 'department',
          values: [
            'Diretoria',
            'Financeiro',
            'Comercial',
            'Marketing',
            'Jurídico',
            'Tecnologia',
            'Relacionamento',
            'Operações',
            'Administrativo',
            'Outro',
          ],
          maxSelect: 1,
        }),
      )
    }
    if (!usersCol.fields.getByName('position')) {
      usersCol.fields.add(
        new SelectField({
          name: 'position',
          values: [
            'Administrador',
            'Diretor',
            'Gerente',
            'Financeiro',
            'Contador',
            'Comercial',
            'Marketing',
            'Publicidade',
            'Atendimento',
            'Suporte',
            'Jurídico',
            'TI',
            'Consultor',
            'Operador',
            'Estagiário',
            'Outro',
          ],
          maxSelect: 1,
        }),
      )
    }
    if (!usersCol.fields.getByName('position_custom')) {
      usersCol.fields.add(new TextField({ name: 'position_custom' }))
    }
    if (!usersCol.fields.getByName('department_custom')) {
      usersCol.fields.add(new TextField({ name: 'department_custom' }))
    }
    if (!usersCol.fields.getByName('cpf')) {
      usersCol.fields.add(new TextField({ name: 'cpf' }))
    }
    if (!usersCol.fields.getByName('rg')) {
      usersCol.fields.add(new TextField({ name: 'rg' }))
    }
    if (!usersCol.fields.getByName('birth_date')) {
      usersCol.fields.add(new DateField({ name: 'birth_date' }))
    }
    if (!usersCol.fields.getByName('phone')) {
      usersCol.fields.add(new TextField({ name: 'phone' }))
    }
    if (!usersCol.fields.getByName('whatsapp')) {
      usersCol.fields.add(new TextField({ name: 'whatsapp' }))
    }
    if (!usersCol.fields.getByName('status')) {
      usersCol.fields.add(
        new SelectField({
          name: 'status',
          values: ['Ativo', 'Inativo', 'Férias', 'Desligado'],
          maxSelect: 1,
        }),
      )
    }
    if (!usersCol.fields.getByName('notes')) {
      usersCol.fields.add(new TextField({ name: 'notes' }))
    }
    if (!usersCol.fields.getByName('created_by')) {
      usersCol.fields.add(
        new RelationField({ name: 'created_by', collectionId: uId, maxSelect: 1 }),
      )
    }
    if (!usersCol.fields.getByName('updated_by')) {
      usersCol.fields.add(
        new RelationField({ name: 'updated_by', collectionId: uId, maxSelect: 1 }),
      )
    }
    if (!usersCol.fields.getByName('active')) {
      usersCol.fields.add(new BoolField({ name: 'active' }))
    }
    if (!usersCol.fields.getByName('deleted_at')) {
      usersCol.fields.add(new DateField({ name: 'deleted_at' }))
    }

    usersCol.listRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)"
    usersCol.viewRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)"
    usersCol.createRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    usersCol.updateRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    usersCol.deleteRule = "id = @request.auth.id || @request.auth.role = 'admin'"

    app.save(usersCol)

    var seeds = [
      {
        email: 'maria.silva@acersol.com.br',
        name: 'Maria Silva',
        dept: 'Financeiro',
        pos: 'Financeiro',
        et: 'CLT',
        cpf: '12345678901',
        ph: '11987654321',
        st: 'Ativo',
      },
      {
        email: 'joao.santos@acersol.com.br',
        name: 'João Santos',
        dept: 'Comercial',
        pos: 'Comercial',
        et: 'CLT',
        cpf: '98765432101',
        ph: '11912345678',
        st: 'Ativo',
      },
      {
        email: 'ana.costa@acersol.com.br',
        name: 'Ana Costa',
        dept: 'Tecnologia',
        pos: 'TI',
        et: 'PJ',
        cpf: '45678912301',
        ph: '11955554444',
        st: 'Férias',
      },
    ]
    for (var i = 0; i < seeds.length; i++) {
      var s = seeds[i]
      try {
        app.findAuthRecordByEmail(uId, s.email)
      } catch (_) {
        var rec = new Record(usersCol)
        rec.setEmail(s.email)
        rec.setPassword('Skip@Pass')
        rec.setVerified(true)
        rec.set('name', s.name)
        rec.set('role', 'employee')
        rec.set('department', s.dept)
        rec.set('position', s.pos)
        rec.set('employee_type', s.et)
        rec.set('cpf', s.cpf)
        rec.set('phone', s.ph)
        rec.set('status', s.st)
        rec.set('active', true)
        app.save(rec)
      }
    }
  },
  (app) => {
    var uId = '_pb_users_auth_'
    var usersCol = app.findCollectionByNameOrId(uId)
    usersCol.listRule = 'id = @request.auth.id'
    usersCol.viewRule = 'id = @request.auth.id'
    usersCol.createRule = ''
    usersCol.updateRule = 'id = @request.auth.id'
    usersCol.deleteRule = 'id = @request.auth.id'
    var fieldsToRemove = [
      'employee_type',
      'department',
      'position',
      'position_custom',
      'department_custom',
      'cpf',
      'rg',
      'birth_date',
      'phone',
      'whatsapp',
      'status',
      'notes',
      'created_by',
      'updated_by',
      'active',
      'deleted_at',
    ]
    for (var i = 0; i < fieldsToRemove.length; i++) {
      var f = usersCol.fields.getByName(fieldsToRemove[i])
      if (f) usersCol.fields.removeById(f.getId())
    }
    var rf = usersCol.fields.getByName('role')
    if (rf) usersCol.fields.removeById(rf.getId())
    usersCol.fields.add(
      new SelectField({ name: 'role', values: ['client', 'owner', 'admin'], maxSelect: 1 }),
    )
    app.save(usersCol)
    var seedEmails = [
      'maria.silva@acersol.com.br',
      'joao.santos@acersol.com.br',
      'ana.costa@acersol.com.br',
    ]
    for (var j = 0; j < seedEmails.length; j++) {
      try {
        app.delete(app.findAuthRecordByEmail(uId, seedEmails[j]))
      } catch (_) {}
    }
  },
)
