onRecordUpdateRequest(
  (e) => {
    const body = e.requestInfo().body || {}
    if (!body.document_number) {
      e.next()
      return
    }

    const doc = (body.document_number || '').trim()
    if (!doc) {
      e.next()
      return
    }

    const digits = doc.replace(/\D/g, '')
    let valid = false

    if (digits.length === 11) {
      let allSame = true
      for (let i = 1; i < 11; i++) {
        if (digits[i] !== digits[0]) {
          allSame = false
          break
        }
      }
      if (!allSame) {
        let sum = 0
        for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
        let r = (sum * 10) % 11
        if (r === 10) r = 0
        if (r === parseInt(digits[9])) {
          sum = 0
          for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
          r = (sum * 10) % 11
          if (r === 10) r = 0
          valid = r === parseInt(digits[10])
        }
      }
    } else if (digits.length === 14) {
      let allSame = true
      for (let i = 1; i < 14; i++) {
        if (digits[i] !== digits[0]) {
          allSame = false
          break
        }
      }
      if (!allSame) {
        const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        let sum = 0
        for (let i = 0; i < 12; i++) sum += parseInt(digits[i]) * w1[i]
        let r = sum % 11
        const d1 = r < 2 ? 0 : 11 - r
        if (d1 === parseInt(digits[12])) {
          sum = 0
          for (let i = 0; i < 13; i++) sum += parseInt(digits[i]) * w2[i]
          r = sum % 11
          const d2 = r < 2 ? 0 : 11 - r
          valid = d2 === parseInt(digits[13])
        }
      }
    }

    if (!valid) {
      throw new BadRequestError('Documento inválido', {
        document_number: new ValidationError('invalid_document', 'Documento inválido'),
      })
    }

    const currentId = e.record.id
    let docConflict = false
    try {
      const rec = $app.findFirstRecordByData('clients', 'document_number', digits)
      if (rec.id !== currentId) docConflict = true
    } catch (_) {}
    if (!docConflict) {
      try {
        const rec = $app.findFirstRecordByData('plants', 'document_number', digits)
        if (rec.id !== currentId) docConflict = true
      } catch (_) {}
    }
    if (docConflict) {
      throw new BadRequestError('Documento já cadastrado', {
        document_number: new ValidationError(
          'not_unique',
          'Este documento já está cadastrado no sistema',
        ),
      })
    }

    e.next()
  },
  'clients',
  'plants',
)
