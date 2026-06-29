export type ClassificationLevel = '1' | '2' | '3'

export const LEVEL_LABELS: Record<ClassificationLevel, string> = {
  '1': 'Informativo',
  '2': 'Operacional',
  '3': 'Crítico',
}

export const LEVEL_DESCRIPTIONS: Record<ClassificationLevel, string> = {
  '1': 'Navegação e busca - log simplificado',
  '2': 'Downloads e exportações - protocolo e auditoria simplificada',
  '3': 'CRUD, financeiro e permissões - protocolo, UUID, hash e trilha completa',
}

export const OPERATION_CLASSIFICATION: Record<string, ClassificationLevel> = {
  View: '1',
  Login: '1',
  Logout: '1',
  Download: '2',
  Export: '2',
  Import: '2',
  Create: '3',
  Update: '3',
  Delete: '3',
  Upload: '3',
}

export function classifyOperation(operationType: string): ClassificationLevel {
  return OPERATION_CLASSIFICATION[operationType] || '3'
}

export const PROTOCOL_PREFIXES = {
  general: 'LOG',
  financial: 'FIN',
  contracts: 'CTR',
  pix: 'PIX',
  audit: 'AUD',
} as const

export function generateProtocol(prefix: string): string {
  const now = new Date()
  const ds = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const ts = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  const rand = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  return `${prefix}-${ds}-${ts}-${rand}`
}
