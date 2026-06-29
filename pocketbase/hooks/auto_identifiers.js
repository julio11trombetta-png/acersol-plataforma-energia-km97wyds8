onRecordCreate(
  (e) => {
    var record = e.record
    var colName = record.collectionName

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

    var prefix = prefixMap[colName]
    if (!prefix) {
      e.next()
      return
    }

    if (!record.getString('uuid')) {
      var chars = '0123456789abcdef'
      var uuid = ''
      for (var i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) uuid += '-'
        else if (i === 14) uuid += '4'
        else if (i === 19) uuid += chars[Math.floor(Math.random() * 4) + 8]
        else uuid += chars[Math.floor(Math.random() * 16)]
      }
      record.set('uuid', uuid)
    }

    if (!record.getString('friendly_code')) {
      var year = new Date().getFullYear()
      var count = 0
      try {
        var existing = $app.findRecordsByFilter(
          colName,
          'friendly_code ~ "' + prefix + '-' + year + '-"',
          '-created',
          1000,
          0,
        )
        count = existing.length
      } catch (_) {}
      var seq = String(count + 1)
      while (seq.length < 6) seq = '0' + seq
      record.set('friendly_code', prefix + '-' + year + '-' + seq)
    }

    e.next()
  },
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
)
