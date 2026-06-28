migrate(
  (app) => {
    try {
      const clients = app.findRecordsByFilter('clients', "id != ''", '-created', 100, 0)
      for (const rec of clients) {
        if (!rec.getString('utilityProvider')) {
          rec.set('utilityProvider', 'RGE')
        }
        if (!rec.getString('state')) {
          rec.set('state', 'RS')
        }
        app.save(rec)
      }
    } catch (_) {}

    try {
      const plants = app.findRecordsByFilter('plants', "id != ''", '-created', 100, 0)
      for (const rec of plants) {
        if (!rec.getString('utilityProvider')) {
          rec.set('utilityProvider', 'RGE')
        }
        if (!rec.getString('state')) {
          rec.set('state', 'RS')
        }
        app.save(rec)
      }
    } catch (_) {}
  },
  (app) => {},
)
