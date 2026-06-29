onRecordCreateRequest((e) => {
  e.next()

  var body = e.requestInfo().body || {}
  var email = body.email || body.username || ''
  if (!email) return

  var ua = e.request ? e.request.header.get('User-Agent') || '' : ''
  var ip = e.request ? e.request.remoteAddr || '' : ''

  var browser = 'Unknown',
    osName = 'Unknown',
    device = 'Desktop'
  if (ua) {
    if (ua.indexOf('Firefox') !== -1) browser = 'Firefox'
    else if (ua.indexOf('Chrome') !== -1) browser = 'Chrome'
    if (ua.indexOf('Windows') !== -1) osName = 'Windows'
    else if (ua.indexOf('Mac') !== -1) osName = 'macOS'
    else if (ua.indexOf('Linux') !== -1) osName = 'Linux'
    if (ua.indexOf('Mobile') !== -1) device = 'Mobile'
  }

  if (e.record && e.record.id) return

  try {
    var histCol = $app.findCollectionByNameOrId('login_history')
    var hist = new Record(histCol)
    hist.set('email', email)
    hist.set('success', false)
    hist.set('failure_reason', 'Credenciais invalidas')
    hist.set('ip_address', ip)
    hist.set('browser', browser)
    hist.set('os', osName)
    hist.set('device', device)
    hist.set('attempt_count', 1)
    hist.set('locked', false)
    $app.saveNoValidate(hist)
  } catch (_) {}
}, '_pb_users_auth_')
