migrate(
  (app) => {
    const crm = app.findCollectionByNameOrId('crm_leads')
    const leads = [
      {
        company: 'Empresa 1 Ltda',
        cnpj: '00.000.000/0001-00',
        type: 'Residencial',
        status: 'Novos Leads',
      },
      {
        company: 'Empresa 2 Ltda',
        cnpj: '11.111.111/0001-11',
        type: 'Comercial',
        status: 'Em Contato',
      },
      {
        company: 'Empresa 3 Ltda',
        cnpj: '22.222.222/0001-22',
        type: 'Industrial',
        status: 'Proposta',
      },
      {
        company: 'Empresa 4 Ltda',
        cnpj: '33.333.333/0001-33',
        type: 'Comercial',
        status: 'Assinado',
      },
    ]
    for (const l of leads) {
      try {
        app.findFirstRecordByData('crm_leads', 'company', l.company)
      } catch (_) {
        const rec = new Record(crm)
        rec.set('company', l.company)
        rec.set('cnpj', l.cnpj)
        rec.set('type', l.type)
        rec.set('status', l.status)
        app.save(rec)
      }
    }

    const cons = app.findCollectionByNameOrId('consumptions')
    const data = [
      { month: 'Jan', consumo: 400, creditos: 450 },
      { month: 'Fev', consumo: 380, creditos: 450 },
      { month: 'Mar', consumo: 420, creditos: 450 },
      { month: 'Abr', consumo: 390, creditos: 450 },
      { month: 'Mai', consumo: 410, creditos: 450 },
      { month: 'Jun', consumo: 450, creditos: 450 },
    ]
    for (const c of data) {
      try {
        app.findFirstRecordByData('consumptions', 'month', c.month)
      } catch (_) {
        const rec = new Record(cons)
        rec.set('month', c.month)
        rec.set('consumo', c.consumo)
        rec.set('creditos', c.creditos)
        app.save(rec)
      }
    }

    const invs = app.findCollectionByNameOrId('invoices')
    const fat = [
      { month: 'Junho 2026', amount: 380, status: 'Pendente' },
      { month: 'Maio 2026', amount: 410, status: 'Pago' },
      { month: 'Abril 2026', amount: 395, status: 'Pago' },
      { month: 'Março 2026', amount: 420, status: 'Pago' },
    ]
    for (const f of fat) {
      try {
        app.findFirstRecordByData('invoices', 'month', f.month)
      } catch (_) {
        const rec = new Record(invs)
        rec.set('month', f.month)
        rec.set('amount', f.amount)
        rec.set('status', f.status)
        app.save(rec)
      }
    }

    const pts = app.findCollectionByNameOrId('plants')
    const plants = [
      {
        name: 'Usina Solar Norte I',
        capacity: 1200,
        location: 'Norte',
        technologyType: 'Solar',
        status: 'Online',
        generation_now: 650,
      },
      {
        name: 'Usina Solar Sul II',
        capacity: 800,
        location: 'Sul',
        technologyType: 'Solar',
        status: 'Online',
        generation_now: 420,
      },
      {
        name: 'Complexo Leste III',
        capacity: 2000,
        location: 'Leste',
        technologyType: 'Solar',
        status: 'Em obras',
        generation_now: 0,
      },
    ]
    for (const p of plants) {
      try {
        app.findFirstRecordByData('plants', 'name', p.name)
      } catch (_) {
        const rec = new Record(pts)
        rec.set('name', p.name)
        rec.set('capacity', p.capacity)
        rec.set('location', p.location)
        rec.set('technologyType', p.technologyType)
        rec.set('status', p.status)
        rec.set('generation_now', p.generation_now)
        app.save(rec)
      }
    }
  },
  (app) => {},
)
