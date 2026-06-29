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
  Newspaper,
  Gavel,
  BarChart2,
  GitBranch,
  Bot,
  Plug,
  Smartphone,
  Shield,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarItem {
  name: string
  path: string
  icon: LucideIcon
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
      { name: 'Associação', path: '/dashboard/admin/clients', icon: Users },
      { name: 'Usinas', path: '/dashboard/admin/plants', icon: Zap },
      { name: 'Distribuidoras', path: '/dashboard/admin/distribuidoras', icon: Building2 },
      { name: 'Operações', path: '/dashboard/admin/operacoes', icon: Activity },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { name: 'Financeiro', path: '/dashboard/admin/finance', icon: DollarSign },
      { name: 'Contratos', path: '/dashboard/admin/contratos', icon: FileText },
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
      { name: 'Segurança', path: '/dashboard/admin/seguranca', icon: Shield },
      { name: 'Configurações', path: '/dashboard/admin/configuracoes', icon: Settings },
    ],
  },
]
