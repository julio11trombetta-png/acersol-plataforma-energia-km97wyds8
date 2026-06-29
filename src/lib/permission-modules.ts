import { ALL_PERMISSIONS } from '@/lib/permissions'

export interface ModulePermissionOption {
  key: string
  label: string
  description: string
}

export interface PermissionModuleConfig {
  name: string
  permissions: ModulePermissionOption[]
}

const P = (key: string, label: string, description: string): ModulePermissionOption => ({
  key,
  label,
  description,
})

export const PERMISSION_MODULES: PermissionModuleConfig[] = [
  {
    name: 'Dashboard',
    permissions: [P('VISUALIZAR', 'Visualizar', 'Acesso ao dashboard principal')],
  },
  {
    name: 'Clientes',
    permissions: [
      P('VISUALIZAR', 'Visualizar', 'Visualizar lista de clientes'),
      P('CADASTRAR', 'Cadastrar', 'Cadastrar novos clientes'),
      P('EDITAR', 'Editar', 'Editar dados de clientes'),
      P('EXCLUIR_LOGICA', 'Excluir', 'Excluir clientes (exclusão lógica)'),
      P('IMPORTAR', 'Importar', 'Importar dados de clientes'),
      P('EXPORTAR', 'Exportar', 'Exportar dados de clientes'),
      P('GERAR_PDF', 'Gerar PDF', 'Gerar relatórios em PDF'),
      P('GERAR_EXCEL', 'Gerar Excel', 'Gerar planilhas Excel'),
    ],
  },
  {
    name: 'Associados',
    permissions: [
      P('VISUALIZAR', 'Visualizar', 'Visualizar associados'),
      P('CADASTRAR', 'Cadastrar', 'Cadastrar novos associados'),
      P('EDITAR', 'Editar', 'Editar dados de associados'),
      P('EXCLUIR_LOGICA', 'Excluir', 'Excluir associados (exclusão lógica)'),
      P('RESTAURAR', 'Restaurar', 'Restaurar associados excluídos'),
      P('IMPORTAR', 'Importar', 'Importar dados de associados'),
      P('EXPORTAR', 'Exportar', 'Exportar dados de associados'),
      P('EMITIR_CONTRATO', 'Emitir Contrato', 'Emitir contratos de associação'),
      P('EXCLUIR_DOCUMENTO', 'Excluir Documento', 'Excluir documentos de associados'),
      P('VISUALIZAR_HISTORICO', 'Visualizar Histórico', 'Visualizar histórico de alterações'),
    ],
  },
  {
    name: 'Usinas',
    permissions: [
      P('VISUALIZAR', 'Visualizar', 'Visualizar usinas'),
      P('CADASTRAR', 'Cadastrar', 'Cadastrar novas usinas'),
      P('EDITAR', 'Editar', 'Editar dados de usinas'),
      P('EXCLUIR_LOGICA', 'Excluir', 'Excluir usinas (exclusão lógica)'),
      P('IMPORTAR', 'Importar', 'Importar dados de usinas'),
      P('EXPORTAR', 'Exportar', 'Exportar dados de usinas'),
      P('VISUALIZAR_HISTORICO', 'Visualizar Histórico', 'Visualizar histórico de usinas'),
    ],
  },
  {
    name: 'Financeiro',
    permissions: [
      P('VISUALIZAR', 'Visualizar', 'Visualizar dados financeiros'),
      P('CADASTRAR', 'Cadastrar', 'Cadastrar lançamentos financeiros'),
      P('EDITAR', 'Editar', 'Editar lançamentos financeiros'),
      P('EXCLUIR_LOGICA', 'Excluir', 'Excluir lançamentos (exclusão lógica)'),
      P('EXPORTAR', 'Exportar', 'Exportar dados financeiros'),
      P('GERAR_PDF', 'Gerar PDF', 'Gerar relatórios financeiros em PDF'),
      P('GERAR_EXCEL', 'Gerar Excel', 'Gerar planilhas financeiras'),
      P('APROVAR', 'Aprovar', 'Aprovar pagamentos e liberações'),
      P('CANCELAR', 'Cancelar', 'Cancelar operações financeiras'),
      P('GERAR_PIX', 'Gerar PIX', 'Gerar cobranças PIX'),
      P('RATEAR_CREDITOS', 'Ratear Créditos', 'Ratear créditos de energia'),
    ],
  },
  {
    name: 'CRM',
    permissions: [
      P('VISUALIZAR', 'Visualizar', 'Visualizar leads e oportunidades'),
      P('CADASTRAR', 'Cadastrar', 'Cadastrar novos leads'),
      P('EDITAR', 'Editar', 'Editar dados de leads'),
      P('EXCLUIR_LOGICA', 'Excluir', 'Excluir leads (exclusão lógica)'),
      P('IMPORTAR', 'Importar', 'Importar dados de leads'),
      P('EXPORTAR', 'Exportar', 'Exportar dados de leads'),
      P('ENVIAR_WHATSAPP', 'Enviar WhatsApp', 'Enviar mensagens via WhatsApp'),
      P('ENVIAR_EMAIL', 'Enviar E-mail', 'Enviar e-mails aos leads'),
    ],
  },
  {
    name: 'Contratos',
    permissions: [
      P('VISUALIZAR', 'Visualizar', 'Visualizar contratos'),
      P('CADASTRAR', 'Cadastrar', 'Cadastrar novos contratos'),
      P('EDITAR', 'Editar', 'Editar dados de contratos'),
      P('EXCLUIR_LOGICA', 'Excluir', 'Excluir contratos (exclusão lógica)'),
      P('EMITIR_CONTRATO', 'Emitir Contrato', 'Emitir novos contratos'),
      P('ASSINAR', 'Assinar', 'Assinar contratos digitalmente'),
      P('CANCELAR', 'Cancelar', 'Cancelar contratos'),
      P('GERAR_PDF', 'Gerar PDF', 'Gerar contratos em PDF'),
      P('VISUALIZAR_HISTORICO', 'Visualizar Histórico', 'Visualizar histórico de contratos'),
    ],
  },
  {
    name: 'Suporte',
    permissions: [
      P('VISUALIZAR', 'Visualizar', 'Visualizar tickets de suporte'),
      P('CADASTRAR', 'Cadastrar', 'Cadastrar novos tickets'),
      P('EDITAR', 'Editar', 'Editar tickets de suporte'),
      P('EXCLUIR_LOGICA', 'Excluir', 'Excluir tickets (exclusão lógica)'),
    ],
  },
  {
    name: 'Auditoria',
    permissions: [
      P('VISUALIZAR_AUDITORIA', 'Visualizar Auditoria', 'Visualizar logs de auditoria'),
      P('AUDITORIA_GLOBAL', 'Auditoria Global', 'Acesso à auditoria global do sistema'),
      P('VISUALIZAR_HISTORICO', 'Visualizar Histórico', 'Visualizar histórico de registros'),
      P('INVESTIGACAO', 'Modo de Investigação', 'Acesso ao modo de investigação'),
    ],
  },
  {
    name: 'Segurança',
    permissions: [
      P('GERENCIAR_USUARIOS', 'Gerenciar Usuários', 'Gerenciar usuários do sistema'),
      P('GERENCIAR_PERMISSOES', 'Gerenciar Permissões', 'Gerenciar permissões e grupos'),
      P('APROVACAO_DUPLA', 'Aprovação Dupla', 'Aprovação dupla para operações críticas'),
      P('ALERTAS_SEGURANCA', 'Alertas de Segurança', 'Gerenciar alertas de segurança'),
      P(
        'VERSAO_DOCUMENTOS',
        'Versionamento de Documentos',
        'Controlar versionamento de documentos',
      ),
    ],
  },
  {
    name: 'Sistema',
    permissions: [
      P('GERENCIAR_CONFIGURACOES', 'Gerenciar Configurações', 'Gerenciar configurações do sistema'),
      P('GERENCIAR_BACKUPS', 'Gerenciar Backups', 'Gerenciar backups do sistema'),
      P('GERENCIAR_INTEGRACOES', 'Gerenciar Integrações', 'Gerenciar integrações externas'),
    ],
  },
  {
    name: 'Comunicação',
    permissions: [
      P('ENVIAR_EMAIL', 'Enviar E-mail', 'Enviar e-mails pelo sistema'),
      P('ENVIAR_WHATSAPP', 'Enviar WhatsApp', 'Enviar mensagens via WhatsApp'),
      P('GERAR_PDF', 'Gerar PDF', 'Gerar documentos em PDF'),
      P('GERAR_EXCEL', 'Gerar Excel', 'Gerar planilhas Excel'),
    ],
  },
]

export const TOTAL_UNIQUE_PERMS = ALL_PERMISSIONS.length
