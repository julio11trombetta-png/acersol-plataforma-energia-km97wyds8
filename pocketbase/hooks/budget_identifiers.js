onRecordCreate((e) => {
  var record = e.record

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

  if (!record.getString('numero')) {
    var year = new Date().getFullYear()
    var count = 0
    try {
      var existing = $app.findRecordsByFilter(
        'budgets',
        'numero ~ "ORC-' + year + '-"',
        '-created',
        1000,
        0,
      )
      count = existing.length
    } catch (_) {}
    var seq = String(count + 1)
    while (seq.length < 6) seq = '0' + seq
    var numero = 'ORC-' + year + '-' + seq
    record.set('numero', numero)
    if (!record.getString('friendly_code')) {
      record.set('friendly_code', numero)
    }
  }

  e.next()
}, 'budgets')
