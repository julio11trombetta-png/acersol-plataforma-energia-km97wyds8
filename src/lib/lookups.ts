import pb from '@/lib/pocketbase/client'

export interface CNPJData {
  nome: string
  fantasia: string
  cnpj: string
  cep: string
  endereco: string
  numero: string
  bairro: string
  municipio: string
  uf: string
  email: string
  telefone: string
}

export interface CEPData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
}

export async function lookupCNPJ(cnpj: string): Promise<CNPJData> {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) throw new Error('CNPJ deve ter 14 dígitos')
  const res = await pb.send(`/backend/v1/lookup/cnpj/${digits}`, { method: 'GET' })
  return res as CNPJData
}

export async function lookupCEP(cep: string): Promise<CEPData> {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) throw new Error('CEP deve ter 8 dígitos')
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
  if (!res.ok) throw new Error('Falha ao consultar CEP')
  const data = await res.json()
  if (data.erro) throw new Error('CEP não encontrado')
  return data as CEPData
}
