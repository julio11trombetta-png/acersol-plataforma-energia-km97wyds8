onRecordAfterCreateSuccess((e) => {
  var auth = e.record
  if (!auth) return e.next()

  var ua = e.request ? e.request.header.get('User-Agent') || '' : ''
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

  var ip = e.request ? e.request.remoteAddr || '' : ''

  try {
    var sessCol = $app.findCollectionByNameOrId('user_sessions')
    var sess = new Record(sessCol)
    sess.set('userId', auth.id)
    sess.set('session_token', $security.randomString(32))
    sess.set('ip_address', ip)
    sess.set('browser', browser)
    sess.set('os', osName)
    sess.set('device', device)
    sess.set('status', 'Ativa')
    $app.saveNoValidate(sess)
  } catch (err) {
    console.log('session log error: ' + err.message)
  }

  try {
    var histCol = $app.findCollectionByNameOrId('login_history')
    var hist = new Record(histCol)
    hist.set('userId', auth.id)
    hist.set('email', auth.getString('email') || '')
    hist.set('success', true)
    hist.set('ip_address', ip)
    hist.set('browser', browser)
    hist.set('os', osName)
    hist.set('device', device)
    hist.set('attempt_count', 0)
    hist.set('locked', false)
    $app.saveNoValidate(hist)
  } catch (err) {
    console.log('login history error: ' + err.message)
  }

  try {
    auth.set('last_login', new Date().toISOString())
    auth.set('login_attempts', 0)
    $app.saveNoValidate(auth)
  } catch (_) {}

  return e.next()
}, '_pb_users_auth_')
