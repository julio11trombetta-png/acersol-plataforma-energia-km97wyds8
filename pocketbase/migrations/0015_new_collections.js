migrate(
  (app) => {
    var cId = app.findCollectionByNameOrId('clients').id
    var pId = app.findCollectionByNameOrId('plants').id
    var lId = app.findCollectionByNameOrId('crm_leads').id
    var uId = '_pb_users_auth_'
    var ar = "@request.auth.id != ''"
    var am = "@request.auth.id != '' && @request.auth.role = 'admin'"

    app.save(
      new Collection({
        name: 'assemblies',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'date', type: 'date' },
          {
            name: 'status',
            type: 'select',
            values: ['Agendada', 'Realizada', 'Cancelada'],
            maxSelect: 1,
          },
          { name: 'location', type: 'text' },
          { name: 'description', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'tickets',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: ar,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'subject', type: 'text', required: true },
          { name: 'description', type: 'text' },
          {
            name: 'status',
            type: 'select',
            values: ['Aberto', 'Em Andamento', 'Resolvido', 'Fechado'],
            maxSelect: 1,
          },
          {
            name: 'priority',
            type: 'select',
            values: ['Baixa', 'Media', 'Alta', 'Urgente'],
            maxSelect: 1,
          },
          { name: 'clientId', type: 'relation', collectionId: cId, maxSelect: 1 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'news',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'content', type: 'text' },
          { name: 'published', type: 'bool' },
          { name: 'publishedAt', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'blog_posts',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'content', type: 'text' },
          { name: 'author', type: 'text' },
          { name: 'published', type: 'bool' },
          { name: 'publishedAt', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'cash_flow',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'type', type: 'select', values: ['Entrada', 'Saida'], maxSelect: 1 },
          { name: 'amount', type: 'number', required: true },
          { name: 'description', type: 'text' },
          { name: 'date', type: 'date' },
          { name: 'category', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'bank_accounts',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'bankName', type: 'text', required: true },
          { name: 'agency', type: 'text' },
          { name: 'accountNumber', type: 'text' },
          { name: 'balance', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'contracts',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'clientId', type: 'relation', collectionId: cId, maxSelect: 1 },
          { name: 'plantId', type: 'relation', collectionId: pId, maxSelect: 1 },
          { name: 'startDate', type: 'date' },
          { name: 'endDate', type: 'date' },
          {
            name: 'status',
            type: 'select',
            values: ['Ativo', 'Expirado', 'Cancelado'],
            maxSelect: 1,
          },
          {
            name: 'document',
            type: 'file',
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'knowledge_base',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'content', type: 'text' },
          { name: 'category', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'activity_logs',
        type: 'base',
        listRule: am,
        viewRule: am,
        createRule: ar,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'userId', type: 'relation', collectionId: uId, maxSelect: 1 },
          { name: 'action', type: 'text', required: true },
          { name: 'entity', type: 'text' },
          { name: 'entityId', type: 'text' },
          { name: 'details', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'crm_contacts',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'leadId', type: 'relation', collectionId: lId, maxSelect: 1 },
          { name: 'name', type: 'text', required: true },
          { name: 'email', type: 'text' },
          { name: 'phone', type: 'text' },
          { name: 'role', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'crm_tasks',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'leadId', type: 'relation', collectionId: lId, maxSelect: 1 },
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text' },
          { name: 'dueDate', type: 'date' },
          {
            name: 'status',
            type: 'select',
            values: ['Pendente', 'Em Andamento', 'Concluida'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
  },
  (app) => {
    var names = [
      'assemblies',
      'tickets',
      'news',
      'blog_posts',
      'cash_flow',
      'bank_accounts',
      'contracts',
      'knowledge_base',
      'activity_logs',
      'crm_contacts',
      'crm_tasks',
    ]
    for (var i = 0; i < names.length; i++) {
      try {
        app.delete(app.findCollectionByNameOrId(names[i]))
      } catch (_) {}
    }
  },
)
