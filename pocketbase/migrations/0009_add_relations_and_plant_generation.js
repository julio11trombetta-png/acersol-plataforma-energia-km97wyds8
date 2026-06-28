migrate(
  (app) => {
    const clientsColId = app.findCollectionByNameOrId('clients').id

    const invoicesCol = app.findCollectionByNameOrId('invoices')
    if (!invoicesCol.fields.getByName('clientId')) {
      invoicesCol.fields.add(
        new RelationField({
          name: 'clientId',
          collectionId: clientsColId,
          maxSelect: 1,
        }),
      )
    }
    app.save(invoicesCol)

    const consumptionsCol = app.findCollectionByNameOrId('consumptions')
    if (!consumptionsCol.fields.getByName('clientId')) {
      consumptionsCol.fields.add(
        new RelationField({
          name: 'clientId',
          collectionId: clientsColId,
          maxSelect: 1,
        }),
      )
    }
    app.save(consumptionsCol)

    const plantsColId = app.findCollectionByNameOrId('plants').id
    const plantGeneration = new Collection({
      name: 'plant_generation',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'month', type: 'text', required: true },
        { name: 'generation', type: 'number', required: true },
        {
          name: 'plantId',
          type: 'relation',
          required: true,
          collectionId: plantsColId,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(plantGeneration)

    try {
      const clients = app.findRecordsByFilter('clients', '', '-created', 50, 0)
      if (clients.length > 0) {
        const invoices = app.findRecordsByFilter('invoices', '', '-created', 50, 0)
        for (let i = 0; i < invoices.length; i++) {
          if (!invoices[i].get('clientId')) {
            invoices[i].set('clientId', clients[i % clients.length].id)
            app.save(invoices[i])
          }
        }
        const consumptions = app.findRecordsByFilter('consumptions', '', '-created', 50, 0)
        for (let i = 0; i < consumptions.length; i++) {
          if (!consumptions[i].get('clientId')) {
            consumptions[i].set('clientId', clients[i % clients.length].id)
            app.save(consumptions[i])
          }
        }
      }

      const plants = app.findRecordsByFilter('plants', '', '-created', 50, 0)
      if (plants.length > 0 && app.countRecords('plant_generation') === 0) {
        const pgCol = app.findCollectionByNameOrId('plant_generation')
        const months = ['Janeiro 2026', 'Fevereiro 2026', 'Marco 2026', 'Abril 2026']
        for (const plant of plants) {
          for (const month of months) {
            const record = new Record(pgCol)
            record.set('month', month)
            record.set('generation', Math.floor(Math.random() * 4000) + 1000)
            record.set('plantId', plant.id)
            app.save(record)
          }
        }
      }
    } catch (e) {
      console.log('Seed data error: ' + e.message)
    }
  },
  (app) => {
    const invoicesCol = app.findCollectionByNameOrId('invoices')
    const invField = invoicesCol.fields.getByName('clientId')
    if (invField) invoicesCol.fields.remove(invField)
    app.save(invoicesCol)

    const consumptionsCol = app.findCollectionByNameOrId('consumptions')
    const consField = consumptionsCol.fields.getByName('clientId')
    if (consField) consumptionsCol.fields.remove(consField)
    app.save(consumptionsCol)

    try {
      const pgCol = app.findCollectionByNameOrId('plant_generation')
      app.delete(pgCol)
    } catch (_) {}
  },
)
