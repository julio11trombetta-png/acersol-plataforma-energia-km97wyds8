export const PROFILE_OPTIONS = [
  'Associado',
  'Proprietário de Usina',
  'Parceiro Comercial',
  'Fornecedor',
  'Prestador de Serviço',
  'Funcionário',
  'Diretor',
  'Conselheiro',
  'Investidor',
  'Administrador',
  'Outro',
] as const

export const FRIENDLY_CODE_PREFIXES: Record<string, string> = {
  clients: 'AS',
  plants: 'US',
  contracts: 'CT',
  invoices: 'FT',
  crm_leads: 'LD',
  tickets: 'CH',
  plant_generation: 'RT',
  consumptions: 'CR',
  associate_documents: 'DOC',
  plant_documents: 'DOC',
}

export const PROTOCOL_PREFIXES = {
  general: 'LOG',
  financial: 'FIN',
  contracts: 'CTR',
  pix: 'PIX',
  audit: 'AUD',
} as const

export const PLANT_TYPES = [
  'Própria da ACERSOL',
  'Usina Alocada',
  'Usina Parceira',
  'Usina Arrendada',
  'Usina de Investidor',
  'Outro',
] as const

export const OPERATION_TYPES = [
  'Create',
  'Update',
  'Delete',
  'View',
  'Import',
  'Export',
  'Login',
  'Logout',
  'Upload',
  'Download',
] as const
