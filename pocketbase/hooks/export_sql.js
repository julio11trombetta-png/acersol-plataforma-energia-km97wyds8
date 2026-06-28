routerAdd(
  'GET',
  '/backend/v1/export-sql',
  (e) => {
    if (!e.auth || e.auth.getString('role') !== 'admin') {
      return e.forbiddenError('Acesso restrito a administradores')
    }

    var cols = [
      {
        name: 'users',
        type: 'auth',
        fields: [
          ['name', 'TEXT'],
          ['avatar', 'TEXT'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
          ['role', 'TEXT'],
          ['force_password_change', 'BOOLEAN DEFAULT 0'],
        ],
        indexes: [
          'CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`)',
          "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != ''",
        ],
      },
      {
        name: 'clients',
        type: 'base',
        fields: [
          ['name', 'TEXT NOT NULL'],
          ['energyUnitId', 'TEXT NOT NULL'],
          ['consumptionProfile', 'TEXT'],
          ['contactInfo', 'TEXT'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
          ['cnpj', 'TEXT'],
          ['cpf', 'TEXT'],
          ['phone', 'TEXT'],
          ['email', 'TEXT'],
          ['address', 'TEXT'],
          ['utilityProvider', 'TEXT'],
          ['state', 'TEXT'],
          ['discount_percentage', 'REAL'],
          ['document_number', 'TEXT'],
        ],
        indexes: [
          "CREATE UNIQUE INDEX `idx_clients_document_number` ON `clients` (`document_number`) WHERE `document_number` IS NOT NULL AND `document_number` != ''",
        ],
      },
      {
        name: 'plants',
        type: 'base',
        fields: [
          ['name', 'TEXT NOT NULL'],
          ['capacity', 'REAL NOT NULL'],
          ['location', 'TEXT'],
          ['technologyType', 'TEXT'],
          ['status', 'TEXT'],
          ['generation_now', 'REAL'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
          ['cnpj', 'TEXT'],
          ['cpf', 'TEXT'],
          ['phone', 'TEXT'],
          ['email', 'TEXT'],
          ['address', 'TEXT'],
          ['utilityProvider', 'TEXT'],
          ['state', 'TEXT'],
          ['document_number', 'TEXT'],
        ],
        indexes: [
          "CREATE UNIQUE INDEX `idx_plants_document_number` ON `plants` (`document_number`) WHERE `document_number` IS NOT NULL AND `document_number` != ''",
        ],
      },
      {
        name: 'crm_leads',
        type: 'base',
        fields: [
          ['company', 'TEXT NOT NULL'],
          ['cnpj', 'TEXT'],
          ['type', 'TEXT'],
          ['status', 'TEXT'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
        ],
        indexes: [],
      },
      {
        name: 'invoices',
        type: 'base',
        fields: [
          ['month', 'TEXT NOT NULL'],
          ['amount', 'REAL NOT NULL'],
          ['status', 'TEXT'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
          ['clientId', 'TEXT'],
          ['due_date', 'TEXT'],
        ],
        indexes: [],
      },
      {
        name: 'consumptions',
        type: 'base',
        fields: [
          ['month', 'TEXT NOT NULL'],
          ['consumo', 'REAL NOT NULL'],
          ['creditos', 'REAL NOT NULL'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
          ['clientId', 'TEXT'],
        ],
        indexes: [],
      },
      {
        name: 'plant_generation',
        type: 'base',
        fields: [
          ['month', 'TEXT NOT NULL'],
          ['generation', 'REAL NOT NULL'],
          ['plantId', 'TEXT NOT NULL'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
          ['repasse_amount', 'REAL'],
          ['status', 'TEXT'],
        ],
        indexes: [],
      },
      {
        name: 'password_management_logs',
        type: 'base',
        fields: [
          ['admin_id', 'TEXT NOT NULL'],
          ['target_user_id', 'TEXT NOT NULL'],
          ['action_type', 'TEXT NOT NULL'],
          ['created', 'TEXT'],
          ['updated', 'TEXT'],
        ],
        indexes: [
          'CREATE INDEX idx_password_logs_target ON password_management_logs (target_user_id)',
          'CREATE INDEX idx_password_logs_created ON password_management_logs (created DESC)',
        ],
      },
    ]

    var authFields = [
      ['username', 'TEXT NOT NULL'],
      ['email', 'TEXT'],
      ['emailVisibility', 'BOOLEAN DEFAULT 0'],
      ['verified', 'BOOLEAN DEFAULT 0'],
      ['tokenKey', 'TEXT'],
      ['password', 'TEXT'],
    ]
    var sensitive = ['tokenKey', 'password']

    function fmt(v) {
      if (v === null || v === undefined) return 'NULL'
      if (typeof v === 'number') return isNaN(v) ? 'NULL' : String(v)
      if (typeof v === 'boolean') return v ? '1' : '0'
      if (typeof v === 'string') return "'" + v.replace(/'/g, "''") + "'"
      if (v instanceof Date) return "'" + v.toISOString().replace(/'/g, "''") + "'"
      if (Array.isArray(v)) {
        return v.length === 0 ? "''" : "'" + JSON.stringify(v).replace(/'/g, "''") + "'"
      }
      if (typeof v === 'object') return "'" + JSON.stringify(v).replace(/'/g, "''") + "'"
      return 'NULL'
    }

    function strToBytes(str) {
      var bytes = []
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i)
        if (c < 128) {
          bytes.push(c)
        } else if (c < 2048) {
          bytes.push(192 | (c >> 6), 128 | (c & 63))
        } else if (c < 55296 || c >= 57344) {
          bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63))
        } else {
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

    var sql = '-- ACERSOL Portal - Database Export\n'
    sql += '-- Generated: ' + new Date().toISOString() + '\n'
    sql += '-- SQLite compatible (PocketBase)\n'
    sql += '-- Sensitive fields (tokenKey, password) have been redacted\n\n'
    sql += 'PRAGMA foreign_keys=OFF;\nBEGIN TRANSACTION;\n\n'

    for (var ci = 0; ci < cols.length; ci++) {
      var col = cols[ci]
      sql += '-- Table: ' + col.name + '\n'
      sql += 'DROP TABLE IF EXISTS `' + col.name + '`;\n'
      sql += 'CREATE TABLE `' + col.name + '` (\n'

      var allFields = [['id', 'TEXT PRIMARY KEY']]
      if (col.type === 'auth') {
        for (var ai = 0; ai < authFields.length; ai++) {
          allFields.push(authFields[ai])
        }
      }
      for (var fi = 0; fi < col.fields.length; fi++) {
        allFields.push(col.fields[fi])
      }

      var colDefs = []
      for (var di = 0; di < allFields.length; di++) {
        colDefs.push('  `' + allFields[di][0] + '` ' + allFields[di][1])
      }
      sql += colDefs.join(',\n') + '\n);\n\n'

      for (var ii = 0; ii < col.indexes.length; ii++) {
        sql += col.indexes[ii] + ';\n'
      }
      if (col.indexes.length > 0) sql += '\n'

      var records = []
      try {
        records = $app.findRecordsByFilter(col.name, "id != ''", '', 100000, 0)
      } catch (_) {}

      if (records.length > 0) {
        sql += '-- Data for ' + col.name + ' (' + records.length + ' records)\n'
        var colNames = []
        for (var cni = 0; cni < allFields.length; cni++) {
          colNames.push('`' + allFields[cni][0] + '`')
        }
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

    sql += 'COMMIT;\n'

    var bytes = strToBytes(sql)
    e.response.header().set('Content-Disposition', 'attachment; filename="acersol_export.sql"')
    return e.blob(200, 'application/sql; charset=utf-8', bytes)
  },
  $apis.requireAuth(),
)
