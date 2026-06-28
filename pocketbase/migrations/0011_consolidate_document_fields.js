migrate(
  (app) => {
    const clientsCol = app.findCollectionByNameOrId('clients')
    if (!clientsCol.fields.getByName('document_number')) {
      clientsCol.fields.add(new TextField({ name: 'document_number' }))
    }
    app.save(clientsCol)

    const plantsCol = app.findCollectionByNameOrId('plants')
    if (!plantsCol.fields.getByName('document_number')) {
      plantsCol.fields.add(new TextField({ name: 'document_number' }))
    }
    app.save(plantsCol)

    app
      .db()
      .newQuery(
        "UPDATE clients SET document_number = CASE WHEN cnpj IS NOT NULL AND cnpj != '' THEN cnpj ELSE cpf END WHERE (document_number IS NULL OR document_number = '') AND (cnpj IS NOT NULL AND cnpj != '' OR cpf IS NOT NULL AND cpf != '')",
      )
      .execute()

    app
      .db()
      .newQuery(
        "UPDATE plants SET document_number = CASE WHEN cnpj IS NOT NULL AND cnpj != '' THEN cnpj ELSE cpf END WHERE (document_number IS NULL OR document_number = '') AND (cnpj IS NOT NULL AND cnpj != '' OR cpf IS NOT NULL AND cpf != '')",
      )
      .execute()

    const clientsCol2 = app.findCollectionByNameOrId('clients')
    const clientCpf = clientsCol2.fields.getByName('cpf')
    if (clientCpf) clientsCol2.fields.remove(clientCpf)
    const clientCnpj = clientsCol2.fields.getByName('cnpj')
    if (clientCnpj) clientsCol2.fields.remove(clientCnpj)
    app.save(clientsCol2)

    const plantsCol2 = app.findCollectionByNameOrId('plants')
    const plantCpf = plantsCol2.fields.getByName('cpf')
    if (plantCpf) plantsCol2.fields.remove(plantCpf)
    const plantCnpj = plantsCol2.fields.getByName('cnpj')
    if (plantCnpj) plantsCol2.fields.remove(plantCnpj)
    app.save(plantsCol2)

    app
      .db()
      .newQuery(
        "DELETE FROM clients WHERE id NOT IN (SELECT MIN(id) FROM clients WHERE document_number IS NOT NULL AND document_number != '' GROUP BY document_number) AND document_number IS NOT NULL AND document_number != ''",
      )
      .execute()

    app
      .db()
      .newQuery(
        "DELETE FROM plants WHERE id NOT IN (SELECT MIN(id) FROM plants WHERE document_number IS NOT NULL AND document_number != '' GROUP BY document_number) AND document_number IS NOT NULL AND document_number != ''",
      )
      .execute()

    const clientsCol3 = app.findCollectionByNameOrId('clients')
    clientsCol3.addIndex(
      'idx_clients_document_number',
      true,
      'document_number',
      "document_number IS NOT NULL AND document_number != ''",
    )
    app.save(clientsCol3)

    const plantsCol3 = app.findCollectionByNameOrId('plants')
    plantsCol3.addIndex(
      'idx_plants_document_number',
      true,
      'document_number',
      "document_number IS NOT NULL AND document_number != ''",
    )
    app.save(plantsCol3)
  },
  (app) => {
    const clientsCol = app.findCollectionByNameOrId('clients')
    if (!clientsCol.fields.getByName('cpf')) {
      clientsCol.fields.add(new TextField({ name: 'cpf' }))
    }
    if (!clientsCol.fields.getByName('cnpj')) {
      clientsCol.fields.add(new TextField({ name: 'cnpj' }))
    }
    const cdn = clientsCol.fields.getByName('document_number')
    if (cdn) clientsCol.fields.remove(cdn)
    clientsCol.removeIndex('idx_clients_document_number')
    app.save(clientsCol)

    const plantsCol = app.findCollectionByNameOrId('plants')
    if (!plantsCol.fields.getByName('cpf')) {
      plantsCol.fields.add(new TextField({ name: 'cpf' }))
    }
    if (!plantsCol.fields.getByName('cnpj')) {
      plantsCol.fields.add(new TextField({ name: 'cnpj' }))
    }
    const pdn = plantsCol.fields.getByName('document_number')
    if (pdn) plantsCol.fields.remove(pdn)
    plantsCol.removeIndex('idx_plants_document_number')
    app.save(plantsCol)
  },
)
