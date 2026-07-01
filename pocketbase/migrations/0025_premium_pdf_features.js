migrate(
  (app) => {
    var ar = "@request.auth.id != ''"
    var am = "@request.auth.id != '' && @request.auth.role = 'admin'"

    var budgetsCol = app.findCollectionByNameOrId('budgets')
    if (!budgetsCol.fields.getByName('presentation_model')) {
      budgetsCol.fields.add(
        new SelectField({
          name: 'presentation_model',
          values: ['executive', 'institutional', 'commercial'],
          maxSelect: 1,
        }),
      )
    }
    app.save(budgetsCol)

    app.save(
      new Collection({
        name: 'institutional_assets',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: am,
        updateRule: am,
        deleteRule: am,
        fields: [
          { name: 'title', type: 'text', required: true },
          {
            name: 'category',
            type: 'select',
            values: ['plant', 'panels', 'industry', 'nature'],
            maxSelect: 1,
          },
          {
            name: 'file',
            type: 'file',
            maxSelect: 1,
            maxSize: 10485760,
            mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          },
          { name: 'url', type: 'text' },
          { name: 'active', type: 'bool' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_inst_assets_category ON institutional_assets (category)'],
      }),
    )

    var assetsCol = app.findCollectionByNameOrId('institutional_assets')
    var seeds = [
      {
        title: 'Usina Solar Vista Aerea',
        category: 'plant',
        url: 'https://img.usecurling.com/p/1200/800?q=solar%20plant%20aerial',
      },
      {
        title: 'Usina Solar Panoramica',
        category: 'plant',
        url: 'https://img.usecurling.com/p/1200/800?q=solar%20energy%20farm',
      },
      {
        title: 'Paineis Fotovoltaicos',
        category: 'panels',
        url: 'https://img.usecurling.com/p/1200/800?q=solar%20panels',
      },
      {
        title: 'Detalhe dos Paineis',
        category: 'panels',
        url: 'https://img.usecurling.com/p/1200/800?q=photovoltaic%20panel',
      },
      {
        title: 'Industria e Energia',
        category: 'industry',
        url: 'https://img.usecurling.com/p/1200/800?q=industry%20solar%20energy',
      },
      {
        title: 'Complexo Industrial',
        category: 'industry',
        url: 'https://img.usecurling.com/p/1200/800?q=factory%20solar',
      },
      {
        title: 'Paisagem Natural',
        category: 'nature',
        url: 'https://img.usecurling.com/p/1200/800?q=nature%20landscape',
      },
      {
        title: 'Sustentabilidade',
        category: 'nature',
        url: 'https://img.usecurling.com/p/1200/800?q=green%20nature',
      },
    ]
    for (var i = 0; i < seeds.length; i++) {
      try {
        app.findFirstRecordByData('institutional_assets', 'title', seeds[i].title)
      } catch (_) {
        var record = new Record(assetsCol)
        record.set('title', seeds[i].title)
        record.set('category', seeds[i].category)
        record.set('url', seeds[i].url)
        record.set('active', true)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      var budgetsCol = app.findCollectionByNameOrId('budgets')
      var pmField = budgetsCol.fields.getByName('presentation_model')
      if (pmField) budgetsCol.fields.removeById(pmField.getId())
      app.save(budgetsCol)
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('institutional_assets'))
    } catch (_) {}
  },
)
