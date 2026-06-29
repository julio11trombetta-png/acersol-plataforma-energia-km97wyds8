onRecordUpdateRequest(
  (e) => {
    var colName = e.record.collectionName
    var fileFields = ['document', 'file', 'photos']

    var original = null
    try {
      original = $app.findRecordById(colName, e.record.id)
    } catch (_) {}

    if (!original) {
      e.next()
      return
    }

    var versionsToCreate = []
    for (var i = 0; i < fileFields.length; i++) {
      var fieldName = fileFields[i]
      var oldFile = original.getString(fieldName)
      if (!oldFile) continue
      var uploaded = []
      try {
        uploaded = e.findUploadedFiles(fieldName)
      } catch (_) {}
      if (uploaded && uploaded.length > 0) {
        versionsToCreate.push({ fieldName: fieldName, oldFile: oldFile })
      }
    }

    e.next()

    if (versionsToCreate.length === 0) return
    var auth = e.auth
    if (!auth) return

    for (var j = 0; j < versionsToCreate.length; j++) {
      var v = versionsToCreate[j]
      try {
        var verCol = $app.findCollectionByNameOrId('document_versions')
        var count = 0
        try {
          var existing = $app.findRecordsByFilter(
            'document_versions',
            'record_id = "' + original.id + '" && field_name = "' + v.fieldName + '"',
            '-version_number',
            1,
            0,
          )
          count = existing.length
        } catch (_) {}
        var ver = new Record(verCol)
        ver.set('collection_name', colName)
        ver.set('record_id', original.id)
        ver.set('field_name', v.fieldName)
        ver.set('version_number', count + 1)
        ver.set('file_name', v.oldFile)
        ver.set('uploaded_by', auth.id)
        ver.set('justification', 'Auto-versioned on file update')
        $app.saveNoValidate(ver)
      } catch (err) {
        console.log('document versioning error: ' + err.message)
      }

      try {
        var custodyCol = $app.findCollectionByNameOrId('chain_of_custody')
        var custody = new Record(custodyCol)
        custody.set('collection_name', colName)
        custody.set('record_id', original.id)
        custody.set('field_name', v.fieldName)
        custody.set('operation', 'archived')
        custody.set('userId', auth.id)
        custody.set('user_name', auth.getString('name') || auth.getString('email') || '')
        custody.set('details', 'Previous version archived: ' + v.oldFile)
        $app.saveNoValidate(custody)
      } catch (_) {}
    }
  },
  'contracts',
  'associate_documents',
  'plant_documents',
)
