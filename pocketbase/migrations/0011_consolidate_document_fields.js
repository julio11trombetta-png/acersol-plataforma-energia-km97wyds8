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
    clientsCol.removeIndex('idx_clients_document_number')
    app.save(clientsCol)

    const plantsCol = app.findCollectionByNameOrId('plants')
    plantsCol.removeIndex('idx_plants_document_number')
    app.save(plantsCol)
  },
)
