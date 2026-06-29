onRecordUpdateRequest(
  (e) => {
    var tracked = [
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
    var colName = e.record.collectionName
    if (tracked.indexOf(colName) === -1) {
      e.next()
      return
    }

    var recordId = e.record.id
    var auth = e.auth
    var body = e.requestInfo().body || {}

    var original = null
    try {
      original = $app.findRecordById(colName, recordId)
    } catch (_) {}

    e.next()

    if (!auth || !original) return

    var updated = e.record
    var changes = {}
    for (var key in body) {
      var oldVal = String(original.get(key) == null ? '' : original.get(key))
      var newVal = String(updated.get(key) == null ? '' : updated.get(key))
      if (oldVal !== newVal) {
        changes[key] = { before: oldVal, after: newVal }
      }
    }

    var now = new Date()
    var dateStr =
      '' +
      now.getFullYear() +
      ('0' + (now.getMonth() + 1)).slice(-2) +
      ('0' + now.getDate()).slice(-2)
    var timeStr =
      ('0' + now.getHours()).slice(-2) +
      ('0' + now.getMinutes()).slice(-2) +
      ('0' + now.getSeconds()).slice(-2)
    var logCount = 0
    try {
      var existing = $app.findRecordsByFilter(
        'audit_logs',
        'protocol ~ "LOG-' + dateStr + '-"',
        '-created',
        1000,
        0,
      )
      logCount = existing.length
    } catch (_) {}
    var logSeq = String(logCount + 1)
    while (logSeq.length < 6) logSeq = '0' + logSeq
    var protocol = 'LOG-' + dateStr + '-' + timeStr + '-' + logSeq

    var chars = '0123456789abcdef'
    var opUuid = ''
    for (var i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) opUuid += '-'
      else if (i === 14) opUuid += '4'
      else if (i === 19) opUuid += chars[Math.floor(Math.random() * 4) + 8]
      else opUuid += chars[Math.floor(Math.random() * 16)]
    }

    var ip = e.request.remoteAddr || ''
    var ua = e.request.header.get('User-Agent') || ''
    var browser = 'Unknown',
      osName = 'Unknown',
      device = 'Desktop'
    if (ua) {
      if (ua.indexOf('Firefox') !== -1) browser = 'Firefox'
      else if (ua.indexOf('Edg') !== -1) browser = 'Edge'
      else if (ua.indexOf('Chrome') !== -1) browser = 'Chrome'
      else if (ua.indexOf('Safari') !== -1) browser = 'Safari'
      if (ua.indexOf('Windows') !== -1) osName = 'Windows'
      else if (ua.indexOf('Mac') !== -1) osName = 'macOS'
      else if (ua.indexOf('Android') !== -1) osName = 'Android'
      else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) osName = 'iOS'
      else if (ua.indexOf('Linux') !== -1) osName = 'Linux'
      if (ua.indexOf('Mobile') !== -1) device = 'Mobile'
      else if (ua.indexOf('Tablet') !== -1) device = 'Tablet'
    }

    var hash = $security.sha256(protocol + opUuid + recordId + colName)

    try {
      var auditCol = $app.findCollectionByNameOrId('audit_logs')
      var log = new Record(auditCol)
      log.set('protocol', protocol)
      log.set('operation_uuid', opUuid)
      log.set('userId', auth.id)
      log.set('user_name', auth.getString('name') || auth.getString('email') || '')
      log.set('user_profile', auth.getString('role') || '')
      log.set('module', colName)
      log.set('screen', colName)
      log.set('collection_name', colName)
      log.set('record_id', recordId)
      log.set('record_uuid', updated.getString('uuid') || original.getString('uuid') || '')
      log.set(
        'record_friendly_code',
        updated.getString('friendly_code') || original.getString('friendly_code') || '',
      )
      log.set('operation_type', 'Update')
      log.set('field_changes', JSON.stringify(changes))
      log.set('ip_address', ip)
      log.set('browser', browser)
      log.set('os', osName)
      log.set('device', device)
      log.set('session_id', auth.id)
      log.set('operation_hash', hash)
      log.set('classification_level', '3')
      $app.saveNoValidate(log)
    } catch (err) {
      console.log('audit log update error: ' + err.message)
    }
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
