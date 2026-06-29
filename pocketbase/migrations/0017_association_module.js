migrate(
  (app) => {
    var clientsCol = app.findCollectionByNameOrId('clients')

    var fieldsToAdd = [
      [
        'associateType',
        function () {
          return new SelectField({
            name: 'associateType',
            values: [
              'Pessoa Física',
              'Pessoa Jurídica',
              'Produtor Rural',
              'Condomínio',
              'Poder Público',
              'Cooperativa',
            ],
          })
        },
      ],
      [
        'birthDate',
        function () {
          return new DateField({ name: 'birthDate' })
        },
      ],
      [
        'gender',
        function () {
          return new SelectField({ name: 'gender', values: ['Masculino', 'Feminino', 'Outro'] })
        },
      ],
      [
        'maritalStatus',
        function () {
          return new SelectField({
            name: 'maritalStatus',
            values: ['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável'],
          })
        },
      ],
      [
        'profession',
        function () {
          return new TextField({ name: 'profession' })
        },
      ],
      [
        'associateStatus',
        function () {
          return new SelectField({
            name: 'associateStatus',
            values: ['Ativo', 'Suspenso', 'Pendente', 'Bloqueado', 'Em Análise', 'Inativo'],
          })
        },
      ],
      [
        'entryDate',
        function () {
          return new DateField({ name: 'entryDate' })
        },
      ],
      [
        'exitDate',
        function () {
          return new DateField({ name: 'exitDate' })
        },
      ],
      [
        'observations',
        function () {
          return new TextField({ name: 'observations' })
        },
      ],
      [
        'city',
        function () {
          return new TextField({ name: 'city' })
        },
      ],
      [
        'whatsapp',
        function () {
          return new TextField({ name: 'whatsapp' })
        },
      ],
      [
        'zipCode',
        function () {
          return new TextField({ name: 'zipCode' })
        },
      ],
      [
        'neighborhood',
        function () {
          return new TextField({ name: 'neighborhood' })
        },
      ],
    ]

    for (var i = 0; i < fieldsToAdd.length; i++) {
      if (!clientsCol.fields.getByName(fieldsToAdd[i][0])) {
        clientsCol.fields.add(fieldsToAdd[i][1]())
      }
    }
    app.save(clientsCol)

    try {
      var existing = app.findRecordsByFilter('clients', "id != ''", '-created', 0, 0)
      for (var j = 0; j < existing.length; j++) {
        if (!existing[j].getString('associateStatus')) {
          existing[j].set('associateStatus', 'Ativo')
          app.save(existing[j])
        }
      }
    } catch (_) {}

    var clientsId = app.findCollectionByNameOrId('clients').id
    var usersId = '_pb_users_auth_'

    app.save(
      new Collection({
        name: 'consumer_units',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        fields: [
          {
            name: 'clientId',
            type: 'relation',
            required: true,
            collectionId: clientsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          { name: 'ucCode', type: 'text', required: true },
          { name: 'utility', type: 'text' },
          { name: 'ucClass', type: 'text' },
          { name: 'tariffGroup', type: 'text' },
          { name: 'subgroup', type: 'text' },
          { name: 'modality', type: 'text' },
          { name: 'averageConsumption', type: 'number' },
          { name: 'contractedDemand', type: 'number' },
          { name: 'status', type: 'select', values: ['Ativa', 'Inativa', 'Em Transição'] },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'associate_documents',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        fields: [
          {
            name: 'clientId',
            type: 'relation',
            required: true,
            collectionId: clientsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          {
            name: 'category',
            type: 'select',
            required: true,
            values: [
              'RG',
              'CPF',
              'CNH',
              'Contrato',
              'Comprovante de Residência',
              'Fatura',
              'Procuração',
              'Outros',
            ],
          },
          { name: 'fileName', type: 'text' },
          {
            name: 'file',
            type: 'file',
            maxSelect: 1,
            maxSize: 10485760,
            mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          },
          { name: 'uploadedBy', type: 'relation', collectionId: usersId, maxSelect: 1 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'dependents',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        fields: [
          {
            name: 'clientId',
            type: 'relation',
            required: true,
            collectionId: clientsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          { name: 'name', type: 'text', required: true },
          {
            name: 'relationship',
            type: 'select',
            values: ['Cônjuge', 'Filho(a)', 'Pai/Mãe', 'Irmão(ã)', 'Outro'],
          },
          { name: 'phone', type: 'text' },
          { name: 'email', type: 'text' },
          { name: 'birthDate', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'occurrences',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        fields: [
          {
            name: 'clientId',
            type: 'relation',
            required: true,
            collectionId: clientsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          {
            name: 'type',
            type: 'select',
            required: true,
            values: ['Contato', 'Pendência', 'Alteração', 'Reclamação', 'Solicitação'],
          },
          { name: 'description', type: 'text', required: true },
          { name: 'date', type: 'date', required: true },
          { name: 'userId', type: 'relation', collectionId: usersId, maxSelect: 1 },
          {
            name: 'status',
            type: 'select',
            values: ['Aberta', 'Em Andamento', 'Resolvida', 'Fechada'],
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
  },
  (app) => {
    var cols = ['consumer_units', 'associate_documents', 'dependents', 'occurrences']
    for (var i = 0; i < cols.length; i++) {
      try {
        app.delete(app.findCollectionByNameOrId(cols[i]))
      } catch (_) {}
    }
  },
)
