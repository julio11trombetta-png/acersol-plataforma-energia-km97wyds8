routerAdd(
  'POST',
  '/backend/v1/approvals/{id}/approve',
  (e) => {
    var userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')
    var body = e.requestInfo().body || {}

    try {
      var rec = $app.findRecordById('approval_requests', e.request.pathValue('id'))
      if (rec.getString('status') !== 'pending') {
        return e.badRequestError('Approval request is not pending')
      }
      if (rec.getString('requested_by') === userId) {
        return e.badRequestError('Cannot approve your own request')
      }
      rec.set('status', 'approved')
      rec.set('approved_by', userId)
      rec.set('approved_by_name', e.auth.getString('name') || e.auth.getString('email') || '')
      rec.set('approval_notes', body.notes || '')
      rec.set('resolved_at', new Date().toISOString())
      $app.saveNoValidate(rec)
      return e.json(200, { status: 'approved' })
    } catch (err) {
      return e.notFoundError('Approval request not found')
    }
  },
  $apis.requireAuth(),
)

routerAdd(
  'POST',
  '/backend/v1/approvals/{id}/reject',
  (e) => {
    var userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')
    var body = e.requestInfo().body || {}

    try {
      var rec = $app.findRecordById('approval_requests', e.request.pathValue('id'))
      if (rec.getString('status') !== 'pending') {
        return e.badRequestError('Approval request is not pending')
      }
      rec.set('status', 'rejected')
      rec.set('approved_by', userId)
      rec.set('approved_by_name', e.auth.getString('name') || e.auth.getString('email') || '')
      rec.set('approval_notes', body.notes || '')
      rec.set('resolved_at', new Date().toISOString())
      $app.saveNoValidate(rec)
      return e.json(200, { status: 'rejected' })
    } catch (err) {
      return e.notFoundError('Approval request not found')
    }
  },
  $apis.requireAuth(),
)
