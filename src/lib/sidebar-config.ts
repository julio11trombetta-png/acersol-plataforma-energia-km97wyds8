import {
  LayoutDashboard,
  Users,
  Zap,
  Building2,
  Activity,
  DollarSign,
  TrendingUp,
  LifeBuoy,
  FileText,
  FileSignature,
  Newspaper,
  Gavel,
  BarChart2,
  GitBranch,
  Bot,
  Plug,
  Search,
  ClipboardCheck,
  Smartphone,
  Shield,
  Settings,
  History,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  KeyRound,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarItem {
  name: string
  path: string
  icon: LucideIcon
  children?: SidebarItem[]
}

export interface SidebarGroupConfig {
  label: string
  items: SidebarItem[]
}

export const sidebarGroups: SidebarGroupConfig[] = [
  {
    label: 'Principal',
    items: [{ name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Gestão',
    items: [
      {
        name: 'Associação',
        path: '/dashboard/admin/associacao',
        icon: Users,
        children: [
          { name: 'Dashboard', path: '/dashboard/admin/associacao', icon: LayoutDashboard },
          { name: 'Associados', path: '/dashboard/admin/associacao/associados', icon: UserCheck },
          {
            name: 'Unidades Consumidoras',
            path: '/dashboard/admin/associacao/unidades-consumidoras',
            icon: Zap,
          },
          { name: 'Documentos', path: '/dashboard/admin/associacao/documentos', icon: FileText },
          { name: 'Contratos', path: '/dashboard/admin/associacao/contratos', icon: FileSignature },
          { name: 'Dependentes', path: '/dashboard/admin/associacao/dependentes', icon: Users },
          { name: 'Histórico', path: '/dashboard/admin/associacao/historico', icon: History },
          {
            name: 'Pendências',
            path: '/dashboard/admin/associacao/pendencias',
            icon: AlertTriangle,
          },
          {
            name: 'Ocorrências',
            path: '/dashboard/admin/associacao/ocorrencias',
            icon: MessageSquare,
          },
        ],
      },
      { name: 'Usinas', path: '/dashboard/admin/plants', icon: Zap },
      { name: 'Distribuidoras', path: '/dashboard/admin/distribuidoras', icon: Building2 },
      { name: 'Operações', path: '/dashboard/admin/operacoes', icon: Activity },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { name: 'Financeiro', path: '/dashboard/admin/finance', icon: DollarSign },
      { name: 'Contratos', path: '/dashboard/admin/contratos', icon: FileSignature },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { name: 'CRM', path: '/dashboard/admin/crm', icon: TrendingUp },
      { name: 'Suporte', path: '/dashboard/admin/suporte', icon: LifeBuoy },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { name: 'CMS', path: '/dashboard/admin/cms', icon: Newspaper },
      { name: 'Governança', path: '/dashboard/admin/governanca', icon: Gavel },
    ],
  },
  {
    label: 'Inteligência',
    items: [
      { name: 'BI', path: '/dashboard/admin/bi', icon: BarChart2 },
      { name: 'Workflow', path: '/dashboard/admin/workflow', icon: GitBranch },
      { name: 'IA', path: '/dashboard/admin/ia', icon: Bot },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { name: 'Integrações', path: '/dashboard/admin/integracoes', icon: Plug },
      { name: 'App', path: '/dashboard/admin/app', icon: Smartphone },
      {
        name: 'Segurança',
        path: '/dashboard/admin/seguranca',
        icon: Shield,
        children: [
          { name: 'Painel', path: '/dashboard/admin/seguranca', icon: Shield },
          { name: 'Investigação', path: '/dashboard/admin/seguranca/investigacao', icon: Search },
          { name: 'Auditoria', path: '/dashboard/admin/seguranca/auditoria', icon: FileText },
          { name: 'Usuários', path: '/dashboard/admin/seguranca/usuarios', icon: UserCheck },
          { name: 'Permissões', path: '/dashboard/admin/seguranca/permissoes', icon: KeyRound },
          {
            name: 'Aprovações',
            path: '/dashboard/admin/seguranca/aprovacoes',
            icon: ClipboardCheck,
          },
        ],
      },
      { name: 'Configurações', path: '/dashboard/admin/configuracoes', icon: Settings },
    ],
  },
]
