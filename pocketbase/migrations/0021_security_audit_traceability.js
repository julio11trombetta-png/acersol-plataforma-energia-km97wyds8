migrate(
  (app) => {
    var ar = "@request.auth.id != ''"
    var am = "@request.auth.id != '' && @request.auth.role = 'admin'"

    var auditCol = app.findCollectionByNameOrId('audit_logs')
    if (!auditCol.fields.getByName('justification')) {
      auditCol.fields.add(new TextField({ name: 'justification' }))
    }
    if (!auditCol.fields.getByName('classification_level')) {
      auditCol.fields.add(
        new SelectField({
          name: 'classification_level',
          values: ['1', '2', '3'],
          maxSelect: 1,
        }),
      )
    }
    app.save(auditCol)

    app.save(
      new Collection({
        name: 'document_versions',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: ar,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'collection_name', type: 'text', required: true },
          { name: 'record_id', type: 'text', required: true },
          { name: 'field_name', type: 'text', required: true },
          { name: 'version_number', type: 'number', required: true },
          { name: 'file_name', type: 'text' },
          { name: 'file', type: 'file', maxSelect: 1, maxSize: 52428800 },
          { name: 'uploaded_by', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'justification', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_doc_versions_record ON document_versions (record_id)'],
      }),
    )

    app.save(
      new Collection({
        name: 'chain_of_custody',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: ar,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'collection_name', type: 'text', required: true },
          { name: 'record_id', type: 'text', required: true },
          { name: 'field_name', type: 'text' },
          {
            name: 'operation',
            type: 'select',
            values: [
              'created',
              'viewed',
              'downloaded',
              'printed',
              'sent',
              'signed',
              'cancelled',
              'archived',
            ],
            maxSelect: 1,
            required: true,
          },
          { name: 'userId', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'user_name', type: 'text' },
          { name: 'ip_address', type: 'text' },
          { name: 'browser', type: 'text' },
          { name: 'details', type: 'text' },
          { name: 'protocol', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_custody_record ON chain_of_custody (record_id)',
          'CREATE INDEX idx_custody_created ON chain_of_custody (created DESC)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'security_alerts',
        type: 'base',
        listRule: am,
        viewRule: am,
        createRule: ar,
        updateRule: am,
        deleteRule: null,
        fields: [
          {
            name: 'type',
            type: 'select',
            values: [
              'failed_logins',
              'unusual_location',
              'unusual_hours',
              'mass_export',
              'mass_delete',
              'permission_change',
              'suspicious_activity',
            ],
            maxSelect: 1,
            required: true,
          },
          {
            name: 'severity',
            type: 'select',
            values: ['low', 'medium', 'high', 'critical'],
            maxSelect: 1,
            required: true,
          },
          { name: 'description', type: 'text', required: true },
          { name: 'userId', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'ip_address', type: 'text' },
          { name: 'metadata', type: 'json' },
          {
            name: 'status',
            type: 'select',
            values: ['open', 'investigating', 'resolved', 'dismissed'],
            maxSelect: 1,
          },
          { name: 'resolved_by', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'resolved_at', type: 'date' },
          { name: 'resolution_notes', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_sec_alerts_status ON security_alerts (status)',
          'CREATE INDEX idx_sec_alerts_created ON security_alerts (created DESC)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'approval_requests',
        type: 'base',
        listRule: ar,
        viewRule: ar,
        createRule: ar,
        updateRule: am,
        deleteRule: null,
        fields: [
          { name: 'collection_name', type: 'text', required: true },
          { name: 'record_id', type: 'text', required: true },
          { name: 'operation_type', type: 'text', required: true },
          { name: 'description', type: 'text', required: true },
          {
            name: 'requested_by',
            type: 'relation',
            collectionId: '_pb_users_auth_',
            maxSelect: 1,
            required: true,
          },
          { name: 'requested_by_name', type: 'text' },
          { name: 'approved_by', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
          { name: 'approved_by_name', type: 'text' },
          {
            name: 'status',
            type: 'select',
            values: ['pending', 'approved', 'rejected', 'expired'],
            maxSelect: 1,
            required: true,
          },
          { name: 'justification', type: 'text' },
          { name: 'approval_notes', type: 'text' },
          { name: 'payload', type: 'json' },
          { name: 'expires_at', type: 'date' },
          { name: 'resolved_at', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_approvals_status ON approval_requests (status)',
          'CREATE INDEX idx_approvals_record ON approval_requests (record_id)',
        ],
      }),
    )
  },
  (app) => {
    var cols = ['document_versions', 'chain_of_custody', 'security_alerts', 'approval_requests']
    for (var i = 0; i < cols.length; i++) {
      try {
        app.delete(app.findCollectionByNameOrId(cols[i]))
      } catch (_) {}
    }
    try {
      var auditCol = app.findCollectionByNameOrId('audit_logs')
      var j = auditCol.fields.getByName('justification')
      if (j) auditCol.fields.removeById(j.getId())
      var c = auditCol.fields.getByName('classification_level')
      if (c) auditCol.fields.removeById(c.getId())
      app.save(auditCol)
    } catch (_) {}
  },
)
