routerAdd(
  'GET',
  '/backend/v1/export-mysql-schema',
  (e) => {
    if (!e.auth || e.auth.getString('role') !== 'admin') {
      return e.forbiddenError('Acesso restrito a administradores')
    }

    function mt(t) {
      var m = {
        t: 'VARCHAR(255)',
        T: 'TEXT',
        n: 'DECIMAL(15,4)',
        i: 'INT',
        b: 'TINYINT(1)',
        j: 'JSON',
        d: 'DATETIME',
        a: 'DATETIME',
        s: 'VARCHAR(255)',
        r: 'VARCHAR(36)',
        f: 'VARCHAR(500)',
        e: 'VARCHAR(255)',
        ed: 'LONGTEXT',
        u: 'TEXT',
      }
      return m[t] || 'TEXT'
    }

    function strToBytes(str) {
      for (var i = 0, bytes = []; i < str.length; i++) {
        var c = str.charCodeAt(i)
        if (c < 128) bytes.push(c)
        else if (c < 2048) bytes.push(192 | (c >> 6), 128 | (c & 63))
        else if (c < 55296 || c >= 57344)
          bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63))
        else {
          i++
          var c2 = str.charCodeAt(i),
            cp = 65536 + ((c & 1023) << 10) + (c2 & 1023)
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

    var af = [
      ['username', 't'],
      ['email', 'e'],
      ['emailVisibility', 'b'],
      ['verified', 'b'],
      ['tokenKey', 't'],
      ['password', 't'],
    ]

    var C = [
      {
        n: 'users',
        a: 1,
        f: [
          ['name', 't'],
          ['avatar', 'f'],
          ['created', 'a'],
          ['updated', 'a'],
          ['force_password_change', 'b'],
          ['login_attempts', 'i'],
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
          ['notes', 'T'],
          ['created_by', 'r'],
          ['updated_by', 'r'],
          ['active', 'b'],
          ['deleted_at', 'd'],
        ],
        r: [
          ['created_by', 'users'],
          ['updated_by', 'users'],
        ],
        x: [
          'CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`)',
          'CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`)',
        ],
      },
      {
        n: 'clients',
        f: [
          ['name', 't'],
          ['energyUnitId', 't'],
          ['consumptionProfile', 't'],
          ['contactInfo', 'T'],
          ['created', 'a'],
          ['updated', 'a'],
          ['cnpj', 't'],
          ['cpf', 't'],
          ['phone', 't'],
          ['email', 'e'],
          ['address', 'T'],
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
          ['observations', 'T'],
          ['city', 't'],
          ['whatsapp', 't'],
          ['zipCode', 't'],
          ['neighborhood', 't'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['profiles', 'j'],
          ['deleted_at', 'd'],
        ],
        r: [],
        x: [
          'CREATE UNIQUE INDEX `idx_clients_document_number` ON `clients` (`document_number`)',
          'CREATE INDEX `idx_clients_uuid` ON `clients` (`uuid`)',
          'CREATE INDEX `idx_clients_fcode` ON `clients` (`friendly_code`)',
        ],
      },
      {
        n: 'plants',
        f: [
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
          ['email', 'e'],
          ['address', 'T'],
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
          ['observacoes', 'T'],
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
        r: [['clientId', 'clients']],
        x: [
          'CREATE UNIQUE INDEX `idx_plants_document_number` ON `plants` (`document_number`)',
          'CREATE INDEX `idx_plants_uuid` ON `plants` (`uuid`)',
          'CREATE INDEX `idx_plants_fcode` ON `plants` (`friendly_code`)',
        ],
      },
      {
        n: 'crm_leads',
        f: [
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
        r: [],
        x: [
          'CREATE INDEX `idx_crm_leads_uuid` ON `crm_leads` (`uuid`)',
          'CREATE INDEX `idx_crm_leads_fcode` ON `crm_leads` (`friendly_code`)',
        ],
      },
      {
        n: 'invoices',
        f: [
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
        r: [['clientId', 'clients']],
        x: [
          'CREATE INDEX `idx_invoices_uuid` ON `invoices` (`uuid`)',
          'CREATE INDEX `idx_invoices_fcode` ON `invoices` (`friendly_code`)',
        ],
      },
      {
        n: 'consumptions',
        f: [
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
        r: [['clientId', 'clients']],
        x: [
          'CREATE INDEX `idx_consumptions_uuid` ON `consumptions` (`uuid`)',
          'CREATE INDEX `idx_consumptions_fcode` ON `consumptions` (`friendly_code`)',
        ],
      },
      {
        n: 'plant_generation',
        f: [
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
          ['observacoes', 'T'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
        r: [['plantId', 'plants']],
        x: [
          'CREATE INDEX `idx_plant_generation_uuid` ON `plant_generation` (`uuid`)',
          'CREATE INDEX `idx_plant_generation_fcode` ON `plant_generation` (`friendly_code`)',
        ],
      },
      {
        n: 'password_management_logs',
        f: [
          ['admin_id', 'r'],
          ['target_user_id', 'r'],
          ['action_type', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [
          ['admin_id', 'users'],
          ['target_user_id', 'users'],
        ],
        x: [
          'CREATE INDEX `idx_password_logs_target` ON `password_management_logs` (`target_user_id`)',
          'CREATE INDEX `idx_password_logs_created` ON `password_management_logs` (`created` DESC)',
        ],
      },
      {
        n: 'assemblies',
        f: [
          ['title', 't'],
          ['date', 'd'],
          ['status', 's'],
          ['location', 't'],
          ['description', 'T'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
        r: [],
        x: [],
      },
      {
        n: 'tickets',
        f: [
          ['subject', 't'],
          ['description', 'T'],
          ['status', 's'],
          ['priority', 's'],
          ['clientId', 'r'],
          ['created', 'a'],
          ['updated', 'a'],
          ['uuid', 't'],
          ['friendly_code', 't'],
          ['deleted_at', 'd'],
        ],
        r: [['clientId', 'clients']],
        x: [
          'CREATE INDEX `idx_tickets_uuid` ON `tickets` (`uuid`)',
          'CREATE INDEX `idx_tickets_fcode` ON `tickets` (`friendly_code`)',
        ],
      },
      {
        n: 'news',
        f: [
          ['title', 't'],
          ['content', 'T'],
          ['published', 'b'],
          ['publishedAt', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
        r: [],
        x: [],
      },
      {
        n: 'blog_posts',
        f: [
          ['title', 't'],
          ['content', 'T'],
          ['author', 't'],
          ['published', 'b'],
          ['publishedAt', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
        r: [],
        x: [],
      },
      {
        n: 'cash_flow',
        f: [
          ['type', 's'],
          ['amount', 'n'],
          ['description', 'T'],
          ['date', 'd'],
          ['category', 't'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
        r: [],
        x: [],
      },
      {
        n: 'bank_accounts',
        f: [
          ['bankName', 't'],
          ['agency', 't'],
          ['accountNumber', 't'],
          ['balance', 'n'],
          ['created', 'a'],
          ['updated', 'a'],
          ['deleted_at', 'd'],
        ],
        r: [],
        x: [],
      },
      {
        n: 'contracts',
        f: [
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
        r: [
          ['clientId', 'clients'],
          ['plantId', 'plants'],
        ],
        x: [
          'CREATE INDEX `idx_contracts_uuid` ON `contracts` (`uuid`)',
          'CREATE INDEX `idx_contracts_fcode` ON `contracts` (`friendly_code`)',
        ],
      },
      {
        n: 'knowledge_base',
        f: [
          ['title', 't'],
          ['content', 'T'],
          ['category', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [],
        x: [],
      },
      {
        n: 'activity_logs',
        f: [
          ['userId', 'r'],
          ['action', 't'],
          ['entity', 't'],
          ['entityId', 't'],
          ['details', 'T'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['userId', 'users']],
        x: [],
      },
      {
        n: 'crm_contacts',
        f: [
          ['leadId', 'r'],
          ['name', 't'],
          ['email', 'e'],
          ['phone', 't'],
          ['role', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['leadId', 'crm_leads']],
        x: [],
      },
      {
        n: 'crm_tasks',
        f: [
          ['leadId', 'r'],
          ['title', 't'],
          ['description', 'T'],
          ['dueDate', 'd'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['leadId', 'crm_leads']],
        x: [],
      },
      {
        n: 'consumer_units',
        f: [
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
        r: [['clientId', 'clients']],
        x: [],
      },
      {
        n: 'associate_documents',
        f: [
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
        r: [
          ['clientId', 'clients'],
          ['uploadedBy', 'users'],
        ],
        x: [
          'CREATE INDEX `idx_associate_documents_uuid` ON `associate_documents` (`uuid`)',
          'CREATE INDEX `idx_associate_documents_fcode` ON `associate_documents` (`friendly_code`)',
        ],
      },
      {
        n: 'dependents',
        f: [
          ['clientId', 'r'],
          ['name', 't'],
          ['relationship', 's'],
          ['phone', 't'],
          ['email', 'e'],
          ['birthDate', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['clientId', 'clients']],
        x: [],
      },
      {
        n: 'occurrences',
        f: [
          ['clientId', 'r'],
          ['type', 's'],
          ['description', 'T'],
          ['date', 'd'],
          ['userId', 'r'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [
          ['clientId', 'clients'],
          ['userId', 'users'],
        ],
        x: [],
      },
      {
        n: 'plant_equipments',
        f: [
          ['plantId', 'r'],
          ['type', 's'],
          ['manufacturer', 't'],
          ['model', 't'],
          ['serial', 't'],
          ['quantity', 'i'],
          ['power', 'n'],
          ['warranty', 't'],
          ['firmware', 't'],
          ['installation_date', 'd'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['plantId', 'plants']],
        x: [],
      },
      {
        n: 'plant_maintenances',
        f: [
          ['plantId', 'r'],
          ['date', 'd'],
          ['type', 's'],
          ['responsible', 't'],
          ['value', 'n'],
          ['description', 'T'],
          ['photos', 'f'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['plantId', 'plants']],
        x: [],
      },
      {
        n: 'plant_documents',
        f: [
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
        r: [
          ['plantId', 'plants'],
          ['uploadedBy', 'users'],
        ],
        x: [
          'CREATE INDEX `idx_plant_documents_uuid` ON `plant_documents` (`uuid`)',
          'CREATE INDEX `idx_plant_documents_fcode` ON `plant_documents` (`friendly_code`)',
        ],
      },
      {
        n: 'audit_logs',
        f: [
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
          ['justification', 'T'],
          ['classification_level', 's'],
        ],
        r: [['userId', 'users']],
        x: [
          'CREATE INDEX `idx_audit_logs_protocol` ON `audit_logs` (`protocol`)',
          'CREATE INDEX `idx_audit_logs_record` ON `audit_logs` (`record_id`)',
          'CREATE INDEX `idx_audit_logs_created` ON `audit_logs` (`created` DESC)',
        ],
      },
      {
        n: 'permission_groups',
        f: [
          ['name', 't'],
          ['description', 'T'],
          ['permissions', 'j'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [],
        x: ['CREATE UNIQUE INDEX `idx_pgroups_name` ON `permission_groups` (`name`)'],
      },
      {
        n: 'user_permissions',
        f: [
          ['userId', 'r'],
          ['permissions', 'j'],
          ['groupIds', 'r'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [
          ['userId', 'users'],
          ['groupIds', 'permission_groups'],
        ],
        x: ['CREATE UNIQUE INDEX `idx_uperm_user` ON `user_permissions` (`userId`)'],
      },
      {
        n: 'user_sessions',
        f: [
          ['userId', 'r'],
          ['session_token', 't'],
          ['ip_address', 't'],
          ['browser', 't'],
          ['os', 't'],
          ['device', 't'],
          ['city', 't'],
          ['login_at', 'a'],
          ['logout_at', 'd'],
          ['duration_seconds', 'i'],
          ['status', 's'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['userId', 'users']],
        x: [
          'CREATE INDEX `idx_sessions_user` ON `user_sessions` (`userId`)',
          'CREATE INDEX `idx_sessions_status` ON `user_sessions` (`status`)',
        ],
      },
      {
        n: 'login_history',
        f: [
          ['userId', 'r'],
          ['email', 't'],
          ['success', 'b'],
          ['failure_reason', 'T'],
          ['ip_address', 't'],
          ['browser', 't'],
          ['os', 't'],
          ['device', 't'],
          ['attempt_count', 'i'],
          ['locked', 'b'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['userId', 'users']],
        x: ['CREATE INDEX `idx_login_hist_user` ON `login_history` (`userId`)'],
      },
      {
        n: 'document_versions',
        f: [
          ['collection_name', 't'],
          ['record_id', 't'],
          ['field_name', 't'],
          ['version_number', 'i'],
          ['file_name', 't'],
          ['file', 'f'],
          ['uploaded_by', 'r'],
          ['justification', 'T'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['uploaded_by', 'users']],
        x: ['CREATE INDEX `idx_doc_versions_record` ON `document_versions` (`record_id`)'],
      },
      {
        n: 'chain_of_custody',
        f: [
          ['collection_name', 't'],
          ['record_id', 't'],
          ['field_name', 't'],
          ['operation', 's'],
          ['userId', 'r'],
          ['user_name', 't'],
          ['ip_address', 't'],
          ['browser', 't'],
          ['details', 'T'],
          ['protocol', 't'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [['userId', 'users']],
        x: [
          'CREATE INDEX `idx_custody_record` ON `chain_of_custody` (`record_id`)',
          'CREATE INDEX `idx_custody_created` ON `chain_of_custody` (`created` DESC)',
        ],
      },
      {
        n: 'security_alerts',
        f: [
          ['type', 's'],
          ['severity', 's'],
          ['description', 'T'],
          ['userId', 'r'],
          ['ip_address', 't'],
          ['metadata', 'j'],
          ['status', 's'],
          ['resolved_by', 'r'],
          ['resolved_at', 'd'],
          ['resolution_notes', 'T'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [
          ['userId', 'users'],
          ['resolved_by', 'users'],
        ],
        x: [
          'CREATE INDEX `idx_sec_alerts_status` ON `security_alerts` (`status`)',
          'CREATE INDEX `idx_sec_alerts_created` ON `security_alerts` (`created` DESC)',
        ],
      },
      {
        n: 'approval_requests',
        f: [
          ['collection_name', 't'],
          ['record_id', 't'],
          ['operation_type', 't'],
          ['description', 'T'],
          ['requested_by', 'r'],
          ['requested_by_name', 't'],
          ['approved_by', 'r'],
          ['approved_by_name', 't'],
          ['status', 's'],
          ['justification', 'T'],
          ['approval_notes', 'T'],
          ['payload', 'j'],
          ['expires_at', 'd'],
          ['resolved_at', 'd'],
          ['created', 'a'],
          ['updated', 'a'],
        ],
        r: [
          ['requested_by', 'users'],
          ['approved_by', 'users'],
        ],
        x: [
          'CREATE INDEX `idx_approvals_status` ON `approval_requests` (`status`)',
          'CREATE INDEX `idx_approvals_record` ON `approval_requests` (`record_id`)',
        ],
      },
    ]

    var now = new Date()
    var dateStr = now.toISOString().split('T')[0]
    var filename = 'acersol_schema_mysql_' + dateStr + '.sql'

    var sql = '-- ACERSOL Portal - MySQL Schema Export (DDL Only)\n'
    sql += '-- Generated: ' + now.toISOString() + '\n'
    sql += '-- Schema only - No data (INSERT statements)\n'
    sql += '-- MySQL compatible (InnoDB, utf8mb4)\n'
    sql += '-- Includes: CREATE TABLE, INDEX, FOREIGN KEY definitions\n\n'
    sql += 'SET FOREIGN_KEY_CHECKS=0;\n\n'

    for (var ci = 0; ci < C.length; ci++) {
      var col = C[ci]
      sql += '-- Table: ' + col.n + '\n'
      sql += 'DROP TABLE IF EXISTS `' + col.n + '`;\n'
      sql += 'CREATE TABLE IF NOT EXISTS `' + col.n + '` (\n'

      var defs = ['  `id` VARCHAR(36) PRIMARY KEY']

      if (col.a) {
        for (var ai = 0; ai < af.length; ai++) {
          defs.push('  `' + af[ai][0] + '` ' + mt(af[ai][1]))
        }
      }

      for (var fi = 0; fi < col.f.length; fi++) {
        defs.push('  `' + col.f[fi][0] + '` ' + mt(col.f[fi][1]))
      }

      for (var ri = 0; ri < (col.r || []).length; ri++) {
        defs.push(
          '  CONSTRAINT `fk_' +
            col.n +
            '_' +
            col.r[ri][0] +
            '` FOREIGN KEY (`' +
            col.r[ri][0] +
            '`) REFERENCES `' +
            col.r[ri][1] +
            '` (`id`) ON DELETE SET NULL',
        )
      }

      sql +=
        defs.join(',\n') +
        '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n'

      for (var ii = 0; ii < (col.x || []).length; ii++) {
        sql += col.x[ii] + ';\n'
      }
      if ((col.x || []).length > 0) sql += '\n'
    }

    sql += 'SET FOREIGN_KEY_CHECKS=1;\n'

    try {
      var ds =
        '' +
        now.getFullYear() +
        ('0' + (now.getMonth() + 1)).slice(-2) +
        ('0' + now.getDate()).slice(-2)
      var ts =
        ('0' + now.getHours()).slice(-2) +
        ('0' + now.getMinutes()).slice(-2) +
        ('0' + now.getSeconds()).slice(-2)
      var logCount = 0
      try {
        var existing = $app.findRecordsByFilter(
          'audit_logs',
          'protocol ~ "LOG-' + ds + '-"',
          '-created',
          1000,
          0,
        )
        logCount = existing.length
      } catch (_) {}
      var logSeq = String(logCount + 1)
      while (logSeq.length < 6) logSeq = '0' + logSeq
      var protocol = 'LOG-' + ds + '-' + ts + '-' + logSeq

      var chars = '0123456789abcdef'
      var opUuid = ''
      for (var i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) opUuid += '-'
        else if (i === 14) opUuid += '4'
        else if (i === 19) opUuid += chars[Math.floor(Math.random() * 4) + 8]
        else opUuid += chars[Math.floor(Math.random() * 16)]
      }

      var hash = $security.sha256(protocol + opUuid + e.auth.id + 'export-mysql-schema')
      var auditCol = $app.findCollectionByNameOrId('audit_logs')
      var log = new Record(auditCol)
      log.set('protocol', protocol)
      log.set('operation_uuid', opUuid)
      log.set('userId', e.auth.id)
      log.set('user_name', e.auth.getString('name') || e.auth.getString('email') || '')
      log.set('user_profile', e.auth.getString('role') || '')
      log.set('module', 'Segurança')
      log.set('screen', 'export')
      log.set('collection_name', 'all')
      log.set('record_id', '')
      log.set('operation_type', 'Export')
      log.set('field_changes', JSON.stringify({ format: 'mysql-schema', filename: filename }))
      log.set('ip_address', e.request.remoteAddr || '')
      log.set('session_id', e.auth.id)
      log.set('operation_hash', hash)
      log.set('classification_level', '3')
      log.set('justification', 'Exportacao de esquema MySQL (DDL only)')
      $app.saveNoValidate(log)
    } catch (err) {
      console.log('audit log export-mysql-schema error: ' + err.message)
    }

    var bytes = strToBytes(sql)
    e.response.header().set('Content-Disposition', 'attachment; filename="' + filename + '"')
    return e.blob(200, 'application/sql; charset=utf-8', bytes)
  },
  $apis.requireAuth(),
)
