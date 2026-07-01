migrate(
  (app) => {
    var ar = "@request.auth.id != ''"
    var am = "@request.auth.id != '' && @request.auth.role = 'admin'"
    var clientsId = app.findCollectionByNameOrId('clients').id
    var plantsId = app.findCollectionByNameOrId('plants').id
    var leadsId = app.findCollectionByNameOrId('crm_leads').id
    var usersId = '_pb_users_auth_'

    app.save(
      new Collection({
        name: 'budgets',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'numero', type: 'text', required: true },
          { name: 'lead_id', type: 'relation', collectionId: leadsId, maxSelect: 1 },
          { name: 'client_id', type: 'relation', collectionId: clientsId, maxSelect: 1 },
          { name: 'plant_id', type: 'relation', collectionId: plantsId, maxSelect: 1 },
          {
            name: 'status',
            type: 'select',
            values: ['Rascunho', 'Enviado', 'Aprovado', 'Recusado', 'Convertido', 'Expirado'],
            maxSelect: 1,
          },
          { name: 'validade', type: 'date' },
          { name: 'cidade', type: 'text' },
          { name: 'estado', type: 'text' },
          { name: 'distribuidora', type: 'text' },
          { name: 'uc', type: 'text' },
          { name: 'classe', type: 'text' },
          { name: 'subclasse', type: 'text' },
          { name: 'modalidade', type: 'text' },
          { name: 'grupo', type: 'text' },
          { name: 'consumo_medio', type: 'number' },
          { name: 'valor_conta', type: 'number' },
          { name: 'economia_percentual', type: 'number' },
          { name: 'economia_mensal', type: 'number' },
          { name: 'economia_anual', type: 'number' },
          { name: 'creditos_necessarios', type: 'number' },
          { name: 'creditos_disponiveis', type: 'number' },
          { name: 'responsavel', type: 'text' },
          { name: 'observacoes', type: 'text' },
          { name: 'impostos_icms', type: 'number' },
          { name: 'impostos_pis', type: 'number' },
          { name: 'impostos_cofins', type: 'number' },
          {
            name: 'pdf',
            type: 'file',
            maxSelect: 1,
            maxSize: 10485760,
            mimeTypes: ['application/pdf'],
          },
          { name: 'uuid', type: 'text' },
          { name: 'friendly_code', type: 'text' },
          { name: 'deleted_at', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [],
      }),
    )

    var budgetsId = app.findCollectionByNameOrId('budgets').id

    app.save(
      new Collection({
        name: 'budget_files',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          {
            name: 'budget_id',
            type: 'relation',
            required: true,
            collectionId: budgetsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          {
            name: 'file',
            type: 'file',
            maxSelect: 1,
            maxSize: 10485760,
            mimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
          },
          { name: 'file_name', type: 'text' },
          { name: 'uploaded_by', type: 'relation', collectionId: usersId, maxSelect: 1 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'budget_history',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: ar,
        updateRule: null,
        deleteRule: null,
        fields: [
          {
            name: 'budget_id',
            type: 'relation',
            required: true,
            collectionId: budgetsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          { name: 'user_id', type: 'relation', collectionId: usersId, maxSelect: 1 },
          { name: 'user_name', type: 'text' },
          { name: 'action', type: 'text', required: true },
          { name: 'details', type: 'text' },
          { name: 'ip_address', type: 'text' },
          { name: 'field_changes', type: 'json' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'budget_messages',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          {
            name: 'budget_id',
            type: 'relation',
            required: true,
            collectionId: budgetsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          { name: 'channel', type: 'select', values: ['WhatsApp', 'Email', 'Link'], maxSelect: 1 },
          { name: 'recipient', type: 'text' },
          { name: 'content', type: 'text' },
          { name: 'sent_by', type: 'relation', collectionId: usersId, maxSelect: 1 },
          { name: 'sent_by_name', type: 'text' },
          {
            name: 'status',
            type: 'select',
            values: ['Enviado', 'Falhou', 'Pendente'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
  },
  (app) => {
    var names = ['budget_messages', 'budget_history', 'budget_files', 'budgets']
    for (var i = 0; i < names.length; i++) {
      try {
        app.delete(app.findCollectionByNameOrId(names[i]))
      } catch (_) {}
    }
  },
)
