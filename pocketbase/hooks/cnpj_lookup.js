routerAdd(
  'GET',
  '/backend/v1/lookup/cnpj/{cnpj}',
  (e) => {
    var cnpj = e.request.pathValue('cnpj') || ''
    var digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) return e.badRequestError('CNPJ inválido')

    var res = $http.send({
      url: 'https://receitaws.com.br/v1/cnpj/' + digits,
      method: 'GET',
      headers: { Accept: 'application/json' },
      timeout: 15,
    })

    if (res.statusCode !== 200) {
      return e.json(res.statusCode, { error: 'Falha ao consultar CNPJ' })
    }

    var data = res.json || {}
    return e.json(200, {
      nome: data.nome || '',
      fantasia: data.fantasia || '',
      cnpj: data.cnpj || digits,
      cep: data.cep || '',
      endereco: data.logradouro || '',
      numero: data.numero || '',
      bairro: data.bairro || '',
      municipio: data.municipio || '',
      uf: data.uf || '',
      email: data.email || '',
      telefone: data.telefone || '',
    })
  },
  $apis.requireAuth(),
)
