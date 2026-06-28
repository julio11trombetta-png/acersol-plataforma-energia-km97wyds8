migrate(
  (app) => {
    const collections = [
      'clients',
      'plants',
      'consumptions',
      'plant_generation',
      'invoices',
      'crm_leads',
    ]

    for (const name of collections) {
      const col = app.findCollectionByNameOrId(name)
      col.createRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
      col.updateRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
      col.deleteRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
      app.save(col)
    }
  },
  (app) => {
    const collections = [
      'clients',
      'plants',
      'consumptions',
      'plant_generation',
      'invoices',
      'crm_leads',
    ]

    for (const name of collections) {
      const col = app.findCollectionByNameOrId(name)
      col.createRule = "@request.auth.id != ''"
      col.updateRule = "@request.auth.id != ''"
      col.deleteRule = "@request.auth.id != ''"
      app.save(col)
    }
  },
)
