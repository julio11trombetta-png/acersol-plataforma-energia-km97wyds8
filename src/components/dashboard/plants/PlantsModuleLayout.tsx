import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Sun,
  Zap,
  Box,
  TrendingUp,
  DollarSign,
  Share2,
  Wrench,
  History,
  Activity,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', path: '/dashboard/admin/plants', icon: LayoutDashboard },
  { name: 'Cadastro', path: '/dashboard/admin/plants/registro', icon: FileText },
  { name: 'Equipamentos', path: '/dashboard/admin/plants/equipamentos', icon: Settings },
  { name: 'Módulos FV', path: '/dashboard/admin/plants/modulos-fotovoltaicos', icon: Sun },
  { name: 'Inversores', path: '/dashboard/admin/plants/inversores', icon: Zap },
  { name: 'Transformadores', path: '/dashboard/admin/plants/transformadores', icon: Box },
  { name: 'Geração', path: '/dashboard/admin/plants/geracao', icon: TrendingUp },
  { name: 'Créditos', path: '/dashboard/admin/plants/creditos', icon: DollarSign },
  { name: 'Rateios', path: '/dashboard/admin/plants/rateios', icon: Share2 },
  { name: 'Manutenções', path: '/dashboard/admin/plants/manutencoes', icon: Wrench },
  { name: 'Documentos', path: '/dashboard/admin/plants/documentos', icon: FileText },
  { name: 'Histórico', path: '/dashboard/admin/plants/historico', icon: History },
  { name: 'Monitoramento', path: '/dashboard/admin/plants/monitoramento', icon: Activity },
]

export function PlantsModuleLayout() {
  const location = useLocation()
  const isActive = (path: string) =>
    path === '/dashboard/admin/plants'
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="space-y-6">
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors',
                isActive(item.path)
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
