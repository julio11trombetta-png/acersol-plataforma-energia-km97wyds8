migrate(
  (app) => {
    const pgCol = app.findCollectionByNameOrId('plant_generation')
    if (!pgCol.fields.getByName('repasse_amount')) {
      pgCol.fields.add(new NumberField({ name: 'repasse_amount' }))
    }
    if (!pgCol.fields.getByName('status')) {
      pgCol.fields.add(
        new SelectField({ name: 'status', values: ['Pendente', 'Pago'], maxSelect: 1 }),
      )
    }
    app.save(pgCol)

    const clientsCol = app.findCollectionByNameOrId('clients')
    if (!clientsCol.fields.getByName('discount_percentage')) {
      clientsCol.fields.add(new NumberField({ name: 'discount_percentage' }))
    }
    app.save(clientsCol)

    const invoicesCol = app.findCollectionByNameOrId('invoices')
    if (!invoicesCol.fields.getByName('due_date')) {
      invoicesCol.fields.add(new DateField({ name: 'due_date' }))
    }
    app.save(invoicesCol)
  },
  (app) => {
    const pgCol = app.findCollectionByNameOrId('plant_generation')
    const ra = pgCol.fields.getByName('repasse_amount')
    if (ra) pgCol.fields.remove(ra)
    const st = pgCol.fields.getByName('status')
    if (st) pgCol.fields.remove(st)
    app.save(pgCol)

    const clientsCol = app.findCollectionByNameOrId('clients')
    const dp = clientsCol.fields.getByName('discount_percentage')
    if (dp) clientsCol.fields.remove(dp)
    app.save(clientsCol)

    const invoicesCol = app.findCollectionByNameOrId('invoices')
    const dd = invoicesCol.fields.getByName('due_date')
    if (dd) invoicesCol.fields.remove(dd)
    app.save(invoicesCol)
  },
)
