export const ALL_PERMISSIONS = [
  'VISUALIZAR',
  'CADASTRAR',
  'EDITAR',
  'EXCLUIR_LOGICA',
  'RESTAURAR',
  'IMPORTAR',
  'EXPORTAR',
  'GERAR_PDF',
  'GERAR_EXCEL',
  'ENVIAR_EMAIL',
  'ENVIAR_WHATSAPP',
  'APROVAR',
  'CANCELAR',
  'ASSINAR',
  'RATEAR_CREDITOS',
  'GERAR_PIX',
  'EMITIR_CONTRATO',
  'EXCLUIR_DOCUMENTO',
  'VISUALIZAR_HISTORICO',
  'VISUALIZAR_AUDITORIA',
  'AUDITORIA_GLOBAL',
  'GERENCIAR_USUARIOS',
  'GERENCIAR_PERMISSOES',
  'GERENCIAR_CONFIGURACOES',
  'GERENCIAR_BACKUPS',
  'GERENCIAR_INTEGRACOES',
  'INVESTIGACAO',
  'APROVACAO_DUPLA',
  'VERSAO_DOCUMENTOS',
  'ALERTAS_SEGURANCA',
] as const

export type Permission = (typeof ALL_PERMISSIONS)[number]

export const PERMISSION_LABELS: Record<Permission, string> = {
  VISUALIZAR: 'Visualizar',
  CADASTRAR: 'Cadastrar',
  EDITAR: 'Editar',
  EXCLUIR_LOGICA: 'Excluir (Lógica)',
  RESTAURAR: 'Restaurar',
  IMPORTAR: 'Importar',
  EXPORTAR: 'Exportar',
  GERAR_PDF: 'Gerar PDF',
  GERAR_EXCEL: 'Gerar Excel',
  ENVIAR_EMAIL: 'Enviar E-mail',
  ENVIAR_WHATSAPP: 'Enviar WhatsApp',
  APROVAR: 'Aprovar',
  CANCELAR: 'Cancelar',
  ASSINAR: 'Assinar',
  RATEAR_CREDITOS: 'Ratear Créditos',
  GERAR_PIX: 'Gerar PIX',
  EMITIR_CONTRATO: 'Emitir Contrato',
  EXCLUIR_DOCUMENTO: 'Excluir Documento',
  VISUALIZAR_HISTORICO: 'Visualizar Histórico',
  VISUALIZAR_AUDITORIA: 'Visualizar Auditoria',
  AUDITORIA_GLOBAL: 'Auditoria Global',
  GERENCIAR_USUARIOS: 'Gerenciar Usuários',
  GERENCIAR_PERMISSOES: 'Gerenciar Permissões',
  GERENCIAR_CONFIGURACOES: 'Gerenciar Configurações',
  GERENCIAR_BACKUPS: 'Gerenciar Backups',
  GERENCIAR_INTEGRACOES: 'Gerenciar Integrações',
  INVESTIGACAO: 'Modo de Investigação',
  APROVACAO_DUPLA: 'Aprovação Dupla',
  VERSAO_DOCUMENTOS: 'Versionamento de Documentos',
  ALERTAS_SEGURANCA: 'Alertas de Segurança',
}

export const AUDIT_WHITELIST = ['juliotrombetta@acersol.com.br']

export function hasPermission(userPerms: string[], perm: string): boolean {
  return userPerms.includes(perm)
}

export function hasAnyPermission(userPerms: string[], perms: string[]): boolean {
  return perms.some((p) => userPerms.includes(p))
}

export function canAccessAudit(email: string, userPerms: string[]): boolean {
  return AUDIT_WHITELIST.includes(email) && userPerms.includes('AUDITORIA_GLOBAL')
}

export function canAccessInvestigation(email: string, userPerms: string[]): boolean {
  return (
    AUDIT_WHITELIST.includes(email) &&
    (userPerms.includes('AUDITORIA_GLOBAL') || userPerms.includes('INVESTIGACAO'))
  )
}
