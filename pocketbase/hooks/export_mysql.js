routerAdd(
  'GET',
  '/backend/v1/export-mysql',
  (e) => {
    if (!e.auth || e.auth.getString('role') !== 'admin') {
      return e.forbiddenError('Acesso restrito a administradores')
    }

    function mt(t) {
      var m = {
        t: 'TEXT',
        n: 'DECIMAL(15,4)',
        b: 'TINYINT(1)',
        d: 'DATETIME',
        a: 'DATETIME',
        s: 'VARCHAR(100)',
        r: 'VARCHAR(36)',
        f: 'TEXT',
        j: 'JSON',
        e: 'VARCHAR(255)',
        u: 'TEXT',
        ed: 'LONGTEXT',
      }
      return m[t] || 'TEXT'
    }

    function fmt(v) {
      if (v === null || v === undefined) return 'NULL'
      if (typeof v === 'number') return isNaN(v) ? 'NULL' : String(v)
      if (typeof v === 'boolean') return v ? '1' : '0'
      if (typeof v === 'string') {
        return (
          "'" +
          v
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\0/g, '\\0') +
          "'"
        )
      }
      if (v instanceof Date) {
        return "'" + v.toISOString().replace('T', ' ').replace(/\..+/, '') + "'"
      }
      if (Array.isArray(v) || typeof v === 'object') {
        return "'" + JSON.stringify(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
      }
      return 'NULL'
    }

    function strToBytes(str) {
      var bytes = []
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i)
        if (c < 128) bytes.push(c)
        else if (c < 2048) bytes.push(192 | (c >> 6), 128 | (c & 63))
        else if (c < 55296 || c >= 57344)
          bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63))
        else {
          i++
          var c2 = str.charCodeAt(i)
          var cp = 65536 + ((c & 1023) << 10) + (c2 & 1023)
          bytes.push(
            240 | (cp >> 18),
            128 | ((cp >> 12) & 63),
            128 | ((cp >> 6) & 63),
            128 | (cp & 63),
          )
        }
      }
      return new Uint8Array(bytes)
    }

    var authFields = [
      ['username', 't'],
      ['email', 'e'],
      ['emailVisibility', 'b'],
      ['verified', 'b'],
      ['tokenKey', 't'],
      ['password', 't'],
    ]
    var sensitive = ['tokenKey', 'password']

    var cols = [
      {
        name: 'users',
        type: 'auth',
        fields: [
          ['name', 't'],
          ['avatar', 'f'],
          ['created', 'a'],
          ['updated', 'a'],
          ['force_password_change', 'b'],
          ['login_attempts', 'n'],
          ['locked_until', 'd'],
          ['last_login', 'd'],
          ['role', 's'],
          ['employee_type', 't'],
          ['department', 's'],
          ['position', 's'],
          ['position_custom', 't'],
          ['department_custom', 't'],
          ['cpf', 't'],
          ['rg', 't'],
          ['birth_date', 'd'],
          ['phone', 't'],
          ['whatsapp', 't'],
          ['status', 's'],
          ['notes', 't'],
          ['created_by', 'r'],
          ['updated_by', 'r'],
          ['active', 'b'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'clients',
        type: 'base',
        fields: [
          ['name', 't'],
          ['energyUnitId', 't'],
          ['consumptionProfile', 't'],
          ['contactInfo', 't'],
          ['created', 'a'],
          ['updated', 'a'],
          ['cnpj', 't'],
          ['cpf', 't'],
          ['phone', 't'],
          ['email', 't'],
          ['address', 't'],
          ['utilityProvider', 't'],
          ['state', 't'],
          ['discount_percentage', 'n'],
          ['document_number', 't'],
          ['associateType', 's'],
          ['birthDate', 'd'],
          ['gender', 's'],
          ['maritalStatus', 's'],
          ['profession', 't'],
          ['associateStatus', 's'],
          ['entryDate', 'd'],
          ['exitDate', 'd'],
          ['observations', 't'],
          ['city', 't'],
          ['whatsapp', 't'],
          ['zipCode', 't'],
          ['neighborhood', 't'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['profiles', 'j'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'plants',
        type: 'base',
        fields: [
          ['name', 't'],
          ['capacity', 'n'],
          ['location', 't'],
          ['technologyType', 't'],
          ['generation_now', 'n'],
          ['created', 'a'],
          ['updated', 'a'],
          ['cnpj', 't'],
          ['cpf', 't'],
          ['phone', 't'],
          ['email', 't'],
          ['address', 't'],
          ['utilityProvider', 't'],
          ['state', 't'],
          ['document_number', 't'],
          ['status', 's'],
          ['codigo_interno', 't'],
          ['latitude', 't'],
          ['longitude', 't'],
          ['uc_geradora', 't'],
          ['responsavel_tecnico', 't'],
          ['crea', 't'],
          ['classe', 't'],
          ['grupo_tarifario', 't'],
          ['subgrupo', 't'],
          ['observacoes', 't'],
          ['city', 't'],
          ['zipCode', 't'],
          ['neighborhood', 't'],
          ['potencia_instalada', 'n'],
          ['potencia_homologada', 'n'],
          ['data_instalacao', 'd'],
          ['data_homologacao', 'd'],
          ['clientId', 'r'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['plant_type', 's'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'crm_leads',
        type: 'base',
        fields: [
          ['company', 't'],
          ['cnpj', 't'],
          ['type', 't'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'invoices',
        type: 'base',
        fields: [
          ['month', 't'],
          ['amount', 'n'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
          ['clientId', 'r'],
          ['due_date', 'd'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'consumptions',
        type: 'base',
        fields: [
          ['month', 't'],
          ['consumo', 'n'],
          ['creditos', 'n'],
          ['created', 'a'],
          ['updated', 'a'],
          ['clientId', 'r'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'plant_generation',
        type: 'base',
        fields: [
          ['month', 't'],
          ['generation', 'n'],
          ['plantId', 'r'],
          ['created', 'a'],
          ['updated', 'a'],
          ['repasse_amount', 'n'],
          ['status', 's'],
          ['injetada', 'n'],
          ['consumo_proprio', 'n'],
          ['perdas', 'n'],
          ['observacoes', 't'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'password_management_logs',
        type: 'base',
        fields: [
          ['admin_id', 'r'],
          ['target_user_id', 'r'],
          ['action_type', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'assemblies',
        type: 'base',
        fields: [
          ['title', 't'],
          ['date', 'd'],
          ['status', 's'],
          ['location', 't'],
          ['description', 't'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'tickets',
        type: 'base',
        fields: [
          ['subject', 't'],
          ['description', 't'],
          ['status', 's'],
          ['priority', 's'],
          ['clientId', 'r'],
          ['created', 'a'],
          ['updated', 'a'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'news',
        type: 'base',
        fields: [
          ['title', 't'],
          ['content', 't'],
          ['published', 'b'],
          ['publishedAt', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'blog_posts',
        type: 'base',
        fields: [
          ['title', 't'],
          ['content', 't'],
          ['author', 't'],
          ['published', 'b'],
          ['publishedAt', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'cash_flow',
        type: 'base',
        fields: [
          ['type', 's'],
          ['amount', 'n'],
          ['description', 't'],
          ['date', 'd'],
          ['category', 't'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'bank_accounts',
        type: 'base',
        fields: [
          ['bankName', 't'],
          ['agency', 't'],
          ['accountNumber', 't'],
          ['balance', 'n'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'contracts',
        type: 'base',
        fields: [
          ['title', 't'],
          ['clientId', 'r'],
          ['plantId', 'r'],
          ['startDate', 'd'],
          ['endDate', 'd'],
          ['status', 's'],
          ['document', 'f'],
          ['created', 'a'],
          ['updated', 'a'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'knowledge_base',
        type: 'base',
        fields: [
          ['title', 't'],
          ['content', 't'],
          ['category', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'activity_logs',
        type: 'base',
        fields: [
          ['userId', 'r'],
          ['action', 't'],
          ['entity', 't'],
          ['entityId', 't'],
          ['details', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'crm_contacts',
        type: 'base',
        fields: [
          ['leadId', 'r'],
          ['name', 't'],
          ['email', 't'],
          ['phone', 't'],
          ['role', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'crm_tasks',
        type: 'base',
        fields: [
          ['leadId', 'r'],
          ['title', 't'],
          ['description', 't'],
          ['dueDate', 'd'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'consumer_units',
        type: 'base',
        fields: [
          ['clientId', 'r'],
          ['ucCode', 't'],
          ['utility', 't'],
          ['ucClass', 't'],
          ['tariffGroup', 't'],
          ['subgroup', 't'],
          ['modality', 't'],
          ['averageConsumption', 'n'],
          ['contractedDemand', 'n'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'associate_documents',
        type: 'base',
        fields: [
          ['clientId', 'r'],
          ['category', 's'],
          ['fileName', 't'],
          ['file', 'f'],
          ['uploadedBy', 'r'],
          ['created', 'a'],
          ['updated', 'a'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'dependents',
        type: 'base',
        fields: [
          ['clientId', 'r'],
          ['name', 't'],
          ['relationship', 's'],
          ['phone', 't'],
          ['email', 't'],
          ['birthDate', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'occurrences',
        type: 'base',
        fields: [
          ['clientId', 'r'],
          ['type', 's'],
          ['description', 't'],
          ['date', 'd'],
          ['userId', 'r'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'plant_equipments',
        type: 'base',
        fields: [
          ['plantId', 'r'],
          ['type', 's'],
          ['manufacturer', 't'],
          ['model', 't'],
          ['serial', 't'],
          ['quantity', 'n'],
          ['power', 'n'],
          ['warranty', 't'],
          ['firmware', 't'],
          ['installation_date', 'd'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'plant_maintenances',
        type: 'base',
        fields: [
          ['plantId', 'r'],
          ['date', 'd'],
          ['type', 's'],
          ['responsible', 't'],
          ['value', 'n'],
          ['description', 't'],
          ['photos', 'f'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'plant_documents',
        type: 'base',
        fields: [
          ['plantId', 'r'],
          ['category', 's'],
          ['fileName', 't'],
          ['file', 'f'],
          ['uploadedBy', 'r'],
          ['created', 'a'],
          ['updated', 'a'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
      },
      {
        name: 'audit_logs',
        type: 'base',
        fields: [
          ['protocol', 't'],
          ['operation_uuid', 't'],
          ['userId', 'r'],
          ['user_name', 't'],
          ['user_profile', 't'],
          ['module', 't'],
          ['screen', 't'],
          ['collection_name', 't'],
          ['record_id', 't'],
          ['record_uuid', 't'],
          ['record_friendly_code', 't'],
          ['operation_type', 's'],
          ['field_changes', 'j'],
          ['ip_address', 't'],
          ['browser', 't'],
          ['os', 't'],
          ['device', 't'],
          ['session_id', 't'],
          ['operation_hash', 't'],
          ['created', 'a'],
          ['updated', 'a'],
          ['justification', 't'],
          ['classification_level', 's'],
        ],
      },
      {
        name: 'permission_groups',
        type: 'base',
        fields: [
          ['name', 't'],
          ['description', 't'],
          ['permissions', 'j'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'user_permissions',
        type: 'base',
        fields: [
          ['userId', 'r'],
          ['permissions', 'j'],
          ['groupIds', 'r'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'user_sessions',
        type: 'base',
        fields: [
          ['userId', 'r'],
          ['session_token', 't'],
          ['ip_address', 't'],
          ['browser', 't'],
          ['os', 't'],
          ['device', 't'],
          ['city', 't'],
          ['login_at', 'a'],
          ['logout_at', 'd'],
          ['duration_seconds', 'n'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'login_history',
        type: 'base',
        fields: [
          ['userId', 'r'],
          ['email', 't'],
          ['success', 'b'],
          ['failure_reason', 't'],
          ['ip_address', 't'],
          ['browser', 't'],
          ['os', 't'],
          ['device', 't'],
          ['attempt_count', 'n'],
          ['locked', 'b'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'document_versions',
        type: 'base',
        fields: [
          ['collection_name', 't'],
          ['record_id', 't'],
          ['field_name', 't'],
          ['version_number', 'n'],
          ['file_name', 't'],
          ['file', 'f'],
          ['uploaded_by', 'r'],
          ['justification', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'chain_of_custody',
        type: 'base',
        fields: [
          ['collection_name', 't'],
          ['record_id', 't'],
          ['field_name', 't'],
          ['operation', 's'],
          ['userId', 'r'],
          ['user_name', 't'],
          ['ip_address', 't'],
          ['browser', 't'],
          ['details', 't'],
          ['protocol', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'security_alerts',
        type: 'base',
        fields: [
          ['type', 's'],
          ['severity', 's'],
          ['description', 't'],
          ['userId', 'r'],
          ['ip_address', 't'],
          ['metadata', 'j'],
          ['status', 's'],
          ['resolved_by', 'r'],
          ['resolved_at', 'd'],
          ['resolution_notes', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
      {
        name: 'approval_requests',
        type: 'base',
        fields: [
          ['collection_name', 't'],
          ['record_id', 't'],
          ['operation_type', 't'],
          ['description', 't'],
          ['requested_by', 'r'],
          ['requested_by_name', 't'],
          ['approved_by', 'r'],
          ['approved_by_name', 't'],
          ['status', 's'],
          ['justification', 't'],
          ['approval_notes', 't'],
          ['payload', 'j'],
          ['expires_at', 'd'],
          ['resolved_at', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
      },
    ]

    var sql = '-- ACERSOL Portal - MySQL Database Export\n'
    sql += '-- Generated: ' + new Date().toISOString() + '\n'
    sql += '-- MySQL compatible (InnoDB, utf8mb4)\n'
    sql += '-- Sensitive fields (tokenKey, password) have been redacted\n\n'
    sql += 'SET FOREIGN_KEY_CHECKS=0;\n\n'

    for (var ci = 0; ci < cols.length; ci++) {
      var col = cols[ci]
      sql += '-- Table: ' + col.name + '\n'
      sql += 'DROP TABLE IF EXISTS `' + col.name + '`;\n'
      sql += 'CREATE TABLE IF NOT EXISTS `' + col.name + '` (\n'

      var allFields = [['id', 'VARCHAR(36) PRIMARY KEY']]
      if (col.type === 'auth') {
        for (var ai = 0; ai < authFields.length; ai++) allFields.push(authFields[ai])
      }
      for (var fi = 0; fi < col.fields.length; fi++) allFields.push(col.fields[fi])

      var colDefs = []
      for (var di = 0; di < allFields.length; di++) {
        var ftype = allFields[di][1]
        var mysqlType = ftype === 'VARCHAR(36) PRIMARY KEY' ? ftype : mt(ftype)
        colDefs.push('  `' + allFields[di][0] + '` ' + mysqlType)
      }
      sql +=
        colDefs.join(',\n') +
        '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n'

      var records = []
      try {
        records = $app.findRecordsByFilter(col.name, "id != ''", '', 100000, 0)
      } catch (_) {}

      if (records.length > 0) {
        sql += '-- Data for ' + col.name + ' (' + records.length + ' records)\n'
        var colNames = []
        for (var cni = 0; cni < allFields.length; cni++)
          colNames.push('`' + allFields[cni][0] + '`')
        for (var ri = 0; ri < records.length; ri++) {
          var record = records[ri]
          var values = []
          for (var vi = 0; vi < allFields.length; vi++) {
            var fname = allFields[vi][0]
            if (sensitive.indexOf(fname) !== -1) {
              values.push("'REDACTED'")
            } else {
              try {
                values.push(fmt(record.get(fname)))
              } catch (_) {
                values.push('NULL')
              }
            }
          }
          sql +=
            'INSERT INTO `' +
            col.name +
            '` (' +
            colNames.join(', ') +
            ') VALUES (' +
            values.join(', ') +
            ');\n'
        }
        sql += '\n'
      } else {
        sql += '-- No data in ' + col.name + '\n\n'
      }
    }

    sql += 'SET FOREIGN_KEY_CHECKS=1;\n'

    try {
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

      var hash = $security.sha256(protocol + opUuid + e.auth.id + 'export-mysql')
      var auditCol = $app.findCollectionByNameOrId('audit_logs')
      var log = new Record(auditCol)
      log.set('protocol', protocol)
      log.set('operation_uuid', opUuid)
      log.set('userId', e.auth.id)
      log.set('user_name', e.auth.getString('name') || e.auth.getString('email') || '')
      log.set('user_profile', e.auth.getString('role') || '')
      log.set('module', 'database')
      log.set('screen', 'dashboard')
      log.set('collection_name', 'all')
      log.set('record_id', '')
      log.set('operation_type', 'Export')
      log.set('field_changes', JSON.stringify({ format: 'mysql' }))
      log.set('ip_address', e.request.remoteAddr || '')
      log.set('session_id', e.auth.id)
      log.set('operation_hash', hash)
      log.set('classification_level', '3')
      log.set('justification', 'Exportacao MySQL do banco de dados')
      $app.saveNoValidate(log)
    } catch (err) {
      console.log('audit log export-mysql error: ' + err.message)
    }

    var bytes = strToBytes(sql)
    e.response
      .header()
      .set('Content-Disposition', 'attachment; filename="acersol_export_mysql.sql"')
    return e.blob(200, 'application/sql; charset=utf-8', bytes)
  },
  $apis.requireAuth(),
)
