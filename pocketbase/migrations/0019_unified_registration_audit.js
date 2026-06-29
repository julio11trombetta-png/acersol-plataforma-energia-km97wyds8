migrate(
  (app) => {
    var collectionsToModify = [
      'clients',
      'plants',
      'contracts',
      'invoices',
      'crm_leads',
      'tickets',
      'plant_generation',
      'consumptions',
      'associate_documents',
      'plant_documents',
    ]

    for (var i = 0; i < collectionsToModify.length; i++) {
      var col = app.findCollectionByNameOrId(collectionsToModify[i])
      if (!col.fields.getByName('uuid')) {
        col.fields.add(new TextField({ name: 'uuid' }))
      }
      if (!col.fields.getByName('friendly_code')) {
        col.fields.add(new TextField({ name: 'friendly_code' }))
      }
      col.addIndex('idx_' + collectionsToModify[i] + '_uuid', false, 'uuid', '')
      col.addIndex('idx_' + collectionsToModify[i] + '_fcode', false, 'friendly_code', '')
      app.save(col)
    }

    var plantsCol = app.findCollectionByNameOrId('plants')
    if (!plantsCol.fields.getByName('plant_type')) {
      plantsCol.fields.add(
        new SelectField({
          name: 'plant_type',
          values: [
            'Própria da ACERSOL',
            'Usina Alocada',
            'Usina Parceira',
            'Usina Arrendada',
            'Usina de Investidor',
            'Outro',
          ],
          maxSelect: 1,
        }),
      )
    }
    app.save(plantsCol)

    var clientsCol = app.findCollectionByNameOrId('clients')
    if (!clientsCol.fields.getByName('profiles')) {
      clientsCol.fields.add(new JSONField({ name: 'profiles' }))
    }
    app.save(clientsCol)

    app.save(
      new Collection({
        name: 'audit_logs',
        type: 'base',
        listRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        viewRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
        createRule: "@request.auth.id != ''",
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'protocol', type: 'text', required: true },
          { name: 'operation_uuid', type: 'text' },
          { name: 'userId', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'user_name', type: 'text' },
          { name: 'user_profile', type: 'text' },
          { name: 'module', type: 'text' },
          { name: 'screen', type: 'text' },
          { name: 'collection_name', type: 'text' },
          { name: 'record_id', type: 'text' },
          { name: 'record_uuid', type: 'text' },
          { name: 'record_friendly_code', type: 'text' },
          {
            name: 'operation_type',
            type: 'select',
            values: [
              'Create',
              'Update',
              'Delete',
              'View',
              'Import',
              'Export',
              'Login',
              'Logout',
              'Upload',
              'Download',
            ],
            maxSelect: 1,
          },
          { name: 'field_changes', type: 'json' },
          { name: 'ip_address', type: 'text' },
          { name: 'browser', type: 'text' },
          { name: 'os', type: 'text' },
          { name: 'device', type: 'text' },
          { name: 'session_id', type: 'text' },
          { name: 'operation_hash', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_audit_logs_protocol ON audit_logs (protocol)',
          'CREATE INDEX idx_audit_logs_record ON audit_logs (record_id)',
          'CREATE INDEX idx_audit_logs_created ON audit_logs (created DESC)',
        ],
      }),
    )

    var prefixMap = {
      clients: 'CAD',
      plants: 'US',
      contracts: 'CT',
      invoices: 'FT',
      crm_leads: 'LD',
      tickets: 'CH',
      plant_generation: 'PG',
      consumptions: 'CR',
      associate_documents: 'DOC',
      plant_documents: 'DOC',
    }
    var year = new Date().getFullYear()

    function genUUID() {
      var chars = '0123456789abcdef'
      var uuid = ''
      for (var j = 0; j < 36; j++) {
        if (j === 8 || j === 13 || j === 18 || j === 23) uuid += '-'
        else if (j === 14) uuid += '4'
        else if (j === 19) uuid += chars[Math.floor(Math.random() * 4) + 8]
        else uuid += chars[Math.floor(Math.random() * 16)]
      }
      return uuid
    }

    for (var colName in prefixMap) {
      var prefix = prefixMap[colName]
      try {
        var records = app.findRecordsByFilter(colName, '', '-created', 1000, 0)
        for (var k = 0; k < records.length; k++) {
          var r = records[k]
          var changed = false
          if (!r.getString('uuid')) {
            r.set('uuid', genUUID())
            changed = true
          }
          if (!r.getString('friendly_code')) {
            var seq = String(k + 1)
            while (seq.length < 6) seq = '0' + seq
            r.set('friendly_code', prefix + '-' + year + '-' + seq)
            changed = true
          }
          if (changed) app.save(r)
        }
      } catch (_) {}
    }

    try {
      var clients = app.findRecordsByFilter('clients', '', '-created', 1000, 0)
      for (var m = 0; m < clients.length; m++) {
        if (!clients[m].get('profiles')) {
          clients[m].set('profiles', JSON.stringify(['Associado']))
          app.save(clients[m])
        }
      }
    } catch (_) {}
  },
  (app) => {
    var cols = [
      'clients',
      'plants',
      'contracts',
      'invoices',
      'crm_leads',
      'tickets',
      'plant_generation',
      'consumptions',
      'associate_documents',
      'plant_documents',
    ]
    for (var i = 0; i < cols.length; i++) {
      try {
        var col = app.findCollectionByNameOrId(cols[i])
        var uf = col.fields.getByName('uuid')
        if (uf) col.fields.removeById(uf.getId())
        var ff = col.fields.getByName('friendly_code')
        if (ff) col.fields.removeById(ff.getId())
        try {
          col.removeIndex('idx_' + cols[i] + '_uuid')
        } catch (_) {}
        try {
          col.removeIndex('idx_' + cols[i] + '_fcode')
        } catch (_) {}
        app.save(col)
      } catch (_) {}
    }
    try {
      var pc = app.findCollectionByNameOrId('plants')
      var pt = pc.fields.getByName('plant_type')
      if (pt) pc.fields.removeById(pt.getId())
      app.save(pc)
    } catch (_) {}
    try {
      var cc = app.findCollectionByNameOrId('clients')
      var pf = cc.fields.getByName('profiles')
      if (pf) cc.fields.removeById(pf.getId())
      app.save(cc)
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('audit_logs'))
    } catch (_) {}
  },
)
