migrate(
  (app) => {
    const clientsCol = app.findCollectionByNameOrId('clients')
    if (!clientsCol.fields.getByName('utilityProvider')) {
      clientsCol.fields.add(new TextField({ name: 'utilityProvider' }))
    }
    if (!clientsCol.fields.getByName('state')) {
      clientsCol.fields.add(new TextField({ name: 'state' }))
    }
    app.save(clientsCol)

    const plantsCol = app.findCollectionByNameOrId('plants')
    if (!plantsCol.fields.getByName('utilityProvider')) {
      plantsCol.fields.add(new TextField({ name: 'utilityProvider' }))
    }
    if (!plantsCol.fields.getByName('state')) {
      plantsCol.fields.add(new TextField({ name: 'state' }))
    }
    app.save(plantsCol)
  },
  (app) => {
    const clientsCol = app.findCollectionByNameOrId('clients')
    const clientUtility = clientsCol.fields.getByName('utilityProvider')
    if (clientUtility) clientsCol.fields.remove(clientUtility)
    const clientState = clientsCol.fields.getByName('state')
    if (clientState) clientsCol.fields.remove(clientState)
    app.save(clientsCol)

    const plantsCol = app.findCollectionByNameOrId('plants')
    const plantUtility = plantsCol.fields.getByName('utilityProvider')
    if (plantUtility) plantsCol.fields.remove(plantUtility)
    const plantState = plantsCol.fields.getByName('state')
    if (plantState) plantsCol.fields.remove(plantState)
    app.save(plantsCol)
  },
)
