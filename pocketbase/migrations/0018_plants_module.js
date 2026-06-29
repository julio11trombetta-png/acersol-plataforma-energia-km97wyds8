migrate(
  (app) => {
    const ar = "@request.auth.id != ''"
    const am = "@request.auth.id != '' && @request.auth.role = 'admin'"

    const plantsCol = app.findCollectionByNameOrId('plants')
    const plantsColId = plantsCol.id
    const clientsColId = app.findCollectionByNameOrId('clients').id

    const statusBackups = {}
    try {
      const existing = app.findRecordsByFilter('plants', '', '', 1000, 0)
      for (const r of existing) {
        statusBackups[r.id] = r.getString('status')
      }
    } catch (_) {}

    const oldStatus = plantsCol.fields.getByName('status')
    if (oldStatus) plantsCol.fields.removeById(oldStatus.getId())
    plantsCol.fields.add(
      new SelectField({
        name: 'status',
        values: ['Em Projeto', 'Em Homologação', 'Ativa', 'Manutenção', 'Suspensa', 'Inativa'],
        maxSelect: 1,
      }),
    )

    const newTextFields = [
      'codigo_interno',
      'latitude',
      'longitude',
      'uc_geradora',
      'responsavel_tecnico',
      'crea',
      'classe',
      'grupo_tarifario',
      'subgrupo',
      'observacoes',
      'city',
      'zipCode',
      'neighborhood',
    ]
    for (const fn of newTextFields) {
      if (!plantsCol.fields.getByName(fn)) plantsCol.fields.add(new TextField({ name: fn }))
    }
    for (const fn of ['potencia_instalada', 'potencia_homologada']) {
      if (!plantsCol.fields.getByName(fn)) plantsCol.fields.add(new NumberField({ name: fn }))
    }
    for (const fn of ['data_instalacao', 'data_homologacao']) {
      if (!plantsCol.fields.getByName(fn)) plantsCol.fields.add(new DateField({ name: fn }))
    }
    if (!plantsCol.fields.getByName('clientId')) {
      plantsCol.fields.add(
        new RelationField({ name: 'clientId', collectionId: clientsColId, maxSelect: 1 }),
      )
    }

    app.save(plantsCol)

    const statusMap = { Online: 'Ativa', 'Em obras': 'Manutenção', Inativo: 'Inativa' }
    for (const id in statusBackups) {
      const newVal = statusMap[statusBackups[id]] || 'Ativa'
      app
        .db()
        .newQuery('UPDATE plants SET status = {:s} WHERE id = {:id}')
        .bind({ s: newVal, id: id })
        .execute()
    }

    const pgCol = app.findCollectionByNameOrId('plant_generation')
    for (const fn of ['injetada', 'consumo_proprio', 'perdas']) {
      if (!pgCol.fields.getByName(fn)) pgCol.fields.add(new NumberField({ name: fn }))
    }
    if (!pgCol.fields.getByName('observacoes'))
      pgCol.fields.add(new TextField({ name: 'observacoes' }))
    app.save(pgCol)

    app.save(
      new Collection({
        name: 'plant_equipments',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          {
            name: 'plantId',
            type: 'relation',
            required: true,
            collectionId: plantsColId,
            maxSelect: 1,
          },
          {
            name: 'type',
            type: 'select',
            required: true,
            values: ['Modulo', 'Inversor', 'Transformador', 'Outro'],
            maxSelect: 1,
          },
          { name: 'manufacturer', type: 'text' },
          { name: 'model', type: 'text' },
          { name: 'serial', type: 'text' },
          { name: 'quantity', type: 'number' },
          { name: 'power', type: 'number' },
          { name: 'warranty', type: 'text' },
          { name: 'firmware', type: 'text' },
          { name: 'installation_date', type: 'date' },
          {
            name: 'status',
            type: 'select',
            values: ['Ativo', 'Inativo', 'Em Manutenção'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'plant_maintenances',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          {
            name: 'plantId',
            type: 'relation',
            required: true,
            collectionId: plantsColId,
            maxSelect: 1,
          },
          { name: 'date', type: 'date', required: true },
          {
            name: 'type',
            type: 'select',
            required: true,
            values: ['Preventiva', 'Corretiva', 'Limpeza', 'Substituição de Equipamento'],
            maxSelect: 1,
          },
          { name: 'responsible', type: 'text' },
          { name: 'value', type: 'number' },
          { name: 'description', type: 'text' },
          {
            name: 'photos',
            type: 'file',
            maxSelect: 10,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png'],
          },
          {
            name: 'status',
            type: 'select',
            values: ['Agendada', 'Em Andamento', 'Concluída', 'Cancelada'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'plant_documents',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          {
            name: 'plantId',
            type: 'relation',
            required: true,
            collectionId: plantsColId,
            maxSelect: 1,
          },
          {
            name: 'category',
            type: 'select',
            required: true,
            values: ['Projeto', 'ART', 'Homologação', 'Licenças', 'Fotos', 'Contratos', 'Outros'],
            maxSelect: 1,
          },
          { name: 'fileName', type: 'text' },
          {
            name: 'file',
            type: 'file',
            maxSelect: 1,
            maxSize: 10485760,
            mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          },
          { name: 'uploadedBy', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
  },
  (app) => {
    const names = ['plant_equipments', 'plant_maintenances', 'plant_documents']
    for (const n of names) {
      try {
        app.delete(app.findCollectionByNameOrId(n))
      } catch (_) {}
    }

    try {
      const pgCol = app.findCollectionByNameOrId('plant_generation')
      for (const fn of ['injetada', 'consumo_proprio', 'perdas', 'observacoes']) {
        const f = pgCol.fields.getByName(fn)
        if (f) pgCol.fields.removeById(f.getId())
      }
      app.save(pgCol)
    } catch (_) {}

    try {
      const plantsCol = app.findCollectionByNameOrId('plants')
      const os = plantsCol.fields.getByName('status')
      if (os) plantsCol.fields.removeById(os.getId())
      plantsCol.fields.add(
        new SelectField({
          name: 'status',
          values: ['Online', 'Em obras', 'Inativo'],
          maxSelect: 1,
        }),
      )
      const removeFields = [
        'codigo_interno',
        'latitude',
        'longitude',
        'uc_geradora',
        'responsavel_tecnico',
        'crea',
        'classe',
        'grupo_tarifario',
        'subgrupo',
        'observacoes',
        'city',
        'zipCode',
        'neighborhood',
        'potencia_instalada',
        'potencia_homologada',
        'data_instalacao',
        'data_homologacao',
        'clientId',
      ]
      for (const fn of removeFields) {
        const f = plantsCol.fields.getByName(fn)
        if (f) plantsCol.fields.removeById(f.getId())
      }
      app.save(plantsCol)
    } catch (_) {}
  },
)
