onRecordAfterCreateSuccess((e) => {
  var record = e.record
  var success = record.getBool('success')
  if (success) return e.next()

  var email = record.getString('email') || ''
  var ip = record.getString('ip_address') || ''
  if (!email) return e.next()

  var failedCount = 0
  try {
    var failed = $app.findRecordsByFilter(
      'login_history',
      'success = false && email = "' + email + '"',
      '-created',
      10,
      0,
    )
    failedCount = failed.length
  } catch (_) {}

  if (failedCount >= 5) {
    try {
      var alertCol = $app.findCollectionByNameOrId('security_alerts')
      var alert = new Record(alertCol)
      alert.set('type', 'failed_logins')
      alert.set('severity', 'high')
      alert.set('description', '5+ tentativas de login falhadas para ' + email)
      alert.set('ip_address', ip)
      alert.set('status', 'open')
      alert.set('metadata', JSON.stringify({ email: email, count: failedCount }))
      $app.saveNoValidate(alert)
    } catch (_) {}
  }

  var hour = new Date().getHours()
  if (hour < 6 || hour > 22) {
    try {
      var nightCol = $app.findCollectionByNameOrId('security_alerts')
      var nightAlert = new Record(nightCol)
      nightAlert.set('type', 'unusual_hours')
      nightAlert.set('severity', 'medium')
      nightAlert.set('description', 'Tentativa de login fora do horario para ' + email)
      nightAlert.set('ip_address', ip)
      nightAlert.set('status', 'open')
      nightAlert.set('metadata', JSON.stringify({ email: email, hour: hour }))
      $app.saveNoValidate(nightAlert)
    } catch (_) {}
  }

  return e.next()
}, 'login_history')
