routerAdd(
  'GET',
  '/backend/v1/investigation/search',
  (e) => {
    var userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')
    var role = e.auth ? e.auth.getString('role') : ''
    if (role !== 'admin') return e.forbiddenError('admin access required')

    var q = (e.request.url.query().get('q') || '').trim()
    if (!q) return e.json(200, { results: [] })

    var results = []
    var searchCols = [
      { name: 'clients', fields: ['friendly_code', 'uuid', 'document_number', 'name', 'email'] },
      { name: 'plants', fields: ['friendly_code', 'uuid', 'document_number', 'name'] },
      { name: 'contracts', fields: ['friendly_code', 'uuid', 'title'] },
      { name: 'invoices', fields: ['friendly_code', 'uuid', 'month'] },
      { name: 'tickets', fields: ['friendly_code', 'uuid', 'subject'] },
      { name: 'crm_leads', fields: ['friendly_code', 'uuid', 'company'] },
      { name: 'plant_generation', fields: ['friendly_code', 'uuid', 'month'] },
      { name: 'consumptions', fields: ['friendly_code', 'uuid', 'month'] },
    ]

    for (var i = 0; i < searchCols.length; i++) {
      var cfg = searchCols[i]
      var parts = []
      for (var j = 0; j < cfg.fields.length; j++) {
        parts.push(cfg.fields[j] + ' ~ "' + q + '"')
      }
      var filter = parts.join(' || ')
      try {
        var records = $app.findRecordsByFilter(cfg.name, filter, '-created', 20, 0)
        for (var k = 0; k < records.length; k++) {
          results.push({
            type: cfg.name,
            id: records[k].id,
            friendly_code: records[k].getString('friendly_code') || '',
            uuid: records[k].getString('uuid') || '',
            label:
              records[k].getString('name') ||
              records[k].getString('title') ||
              records[k].getString('company') ||
              records[k].getString('subject') ||
              records[k].getString('month') ||
              '',
            created: records[k].getString('created') || '',
          })
        }
      } catch (_) {}
    }

    try {
      var auditFilter =
        'protocol ~ "' +
        q +
        '" || record_uuid ~ "' +
        q +
        '" || record_friendly_code ~ "' +
        q +
        '" || record_id = "' +
        q +
        '" || user_name ~ "' +
        q +
        '"'
      var logs = $app.findRecordsByFilter('audit_logs', auditFilter, '-created', 50, 0)
      for (var m = 0; m < logs.length; m++) {
        results.push({
          type: 'audit_log',
          id: logs[m].id,
          friendly_code: logs[m].getString('protocol') || '',
          uuid: logs[m].getString('operation_uuid') || '',
          label: logs[m].getString('operation_type') + ' - ' + logs[m].getString('collection_name'),
          created: logs[m].getString('created') || '',
        })
      }
    } catch (_) {}

    return e.json(200, { results: results })
  },
  $apis.requireAuth(),
)
