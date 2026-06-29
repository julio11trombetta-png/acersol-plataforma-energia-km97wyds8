routerAdd(
  'POST',
  '/backend/v1/approvals',
  (e) => {
    var body = e.requestInfo().body || {}
    var userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')

    if (!body.collection_name || !body.record_id || !body.operation_type) {
      return e.badRequestError('collection_name, record_id, and operation_type are required')
    }

    try {
      var col = $app.findCollectionByNameOrId('approval_requests')
      var rec = new Record(col)
      rec.set('collection_name', body.collection_name)
      rec.set('record_id', body.record_id)
      rec.set('operation_type', body.operation_type)
      rec.set('description', body.description || '')
      rec.set('requested_by', userId)
      rec.set('requested_by_name', e.auth.getString('name') || e.auth.getString('email') || '')
      rec.set('status', 'pending')
      rec.set('justification', body.justification || '')
      rec.set('payload', JSON.stringify(body.payload || {}))
      if (body.expires_at) rec.set('expires_at', body.expires_at)
      $app.saveNoValidate(rec)
      return e.json(201, { id: rec.id, status: 'pending' })
    } catch (err) {
      return e.json(500, { error: 'Failed to create approval request' })
    }
  },
  $apis.requireAuth(),
)

routerAdd(
  'GET',
  '/backend/v1/approvals',
  (e) => {
    var userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')
    var status = e.request.url.query().get('status') || 'pending'
    try {
      var records = $app.findRecordsByFilter(
        'approval_requests',
        'status = "' + status + '"',
        '-created',
        50,
        0,
      )
      return e.json(200, { items: records })
    } catch (_) {
      return e.json(200, { items: [] })
    }
  },
  $apis.requireAuth(),
)
