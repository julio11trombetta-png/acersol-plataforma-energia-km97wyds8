migrate(
  (app) => {
    const clients = new Collection({
      name: 'clients',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'energyUnitId', type: 'text', required: true },
        { name: 'consumptionProfile', type: 'text' },
        { name: 'contactInfo', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(clients)

    const plants = new Collection({
      name: 'plants',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'capacity', type: 'number', required: true },
        { name: 'location', type: 'text' },
        { name: 'technologyType', type: 'text' },
        { name: 'status', type: 'select', values: ['Online', 'Em obras', 'Inativo'], maxSelect: 1 },
        { name: 'generation_now', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(plants)

    const crm_leads = new Collection({
      name: 'crm_leads',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'company', type: 'text', required: true },
        { name: 'cnpj', type: 'text' },
        { name: 'type', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['Novos Leads', 'Em Contato', 'Proposta', 'Assinado'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(crm_leads)

    const invoices = new Collection({
      name: 'invoices',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'month', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'status', type: 'select', values: ['Pendente', 'Pago', 'Atrasado'], maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(invoices)

    const consumptions = new Collection({
      name: 'consumptions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'month', type: 'text', required: true },
        { name: 'consumo', type: 'number', required: true },
        { name: 'creditos', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(consumptions)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('consumptions'))
    app.delete(app.findCollectionByNameOrId('invoices'))
    app.delete(app.findCollectionByNameOrId('crm_leads'))
    app.delete(app.findCollectionByNameOrId('plants'))
    app.delete(app.findCollectionByNameOrId('clients'))
  },
)
