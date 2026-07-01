migrate(
  (app) => {
    var ar = "@request.auth.id != ''"
    var am = "@request.auth.id != '' && @request.auth.role = 'admin'"
    var budgetsId = app.findCollectionByNameOrId('budgets').id

    app.save(
      new Collection({
        name: 'budget_units',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: ar,
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
          { name: 'numero_uc', type: 'text', required: true },
          { name: 'distribuidora', type: 'text' },
          { name: 'cidade', type: 'text' },
          { name: 'estado', type: 'text' },
          { name: 'classe', type: 'text' },
          { name: 'subclasse', type: 'text' },
          { name: 'modalidade', type: 'text' },
          { name: 'grupo_tarifario', type: 'text' },
          {
            name: 'status',
            type: 'select',
            values: ['Ativa', 'Inativa', 'Em Transição'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_budget_units_budget ON budget_units (budget_id)'],
      }),
    )

    var unitsId = app.findCollectionByNameOrId('budget_units').id

    app.save(
      new Collection({
        name: 'budget_monthly_consumption',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: ar,
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
            name: 'unit_id',
            type: 'relation',
            required: true,
            collectionId: unitsId,
            maxSelect: 1,
            cascadeDelete: true,
          },
          { name: 'mes', type: 'text', required: true },
          { name: 'ano', type: 'number' },
          { name: 'consumo_kwh', type: 'number' },
          { name: 'valor_conta', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_bmc_budget ON budget_monthly_consumption (budget_id)',
          'CREATE INDEX idx_bmc_unit ON budget_monthly_consumption (unit_id)',
        ],
      }),
    )

    var budgetsCol = app.findCollectionByNameOrId('budgets')
    var cField = budgetsCol.fields.getByName('consumo_medio')
    if (cField) budgetsCol.fields.removeById(cField.getId())
    var vField = budgetsCol.fields.getByName('valor_conta')
    if (vField) budgetsCol.fields.removeById(vField.getId())
    app.save(budgetsCol)
  },
  (app) => {
    var names = ['budget_monthly_consumption', 'budget_units']
    for (var i = 0; i < names.length; i++) {
      try {
        app.delete(app.findCollectionByNameOrId(names[i]))
      } catch (_) {}
    }
    try {
      var budgetsCol = app.findCollectionByNameOrId('budgets')
      if (!budgetsCol.fields.getByName('consumo_medio')) {
        budgetsCol.fields.add(new NumberField({ name: 'consumo_medio' }))
      }
      if (!budgetsCol.fields.getByName('valor_conta')) {
        budgetsCol.fields.add(new NumberField({ name: 'valor_conta' }))
      }
      app.save(budgetsCol)
    } catch (_) {}
  },
)
