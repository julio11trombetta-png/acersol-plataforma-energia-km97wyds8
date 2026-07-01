onRecordBeforeSaveRequest(
  (e) => {
    const record = e.record
    const fields = ['document_number', 'cpf', 'cnpj', 'rg', 'phone', 'whatsapp', 'zipCode']
    fields.forEach((f) => {
      const val = record.getString(f)
      if (val) {
        record.set(f, val.replace(/\D/g, ''))
      }
    })
    e.next()
  },
  'users',
  'clients',
  'plants',
  'crm_leads',
  'budgets',
)
