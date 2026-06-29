import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  Zap,
  FileText,
  FileSignature,
  TrendingUp,
  LifeBuoy,
  Upload,
  Download,
} from 'lucide-react'

const actions = [
  {
    label: 'Novo Associado',
    path: '/dashboard/admin/clients',
    icon: Users,
    color: 'text-brand-blue bg-brand-blue/10',
  },
  {
    label: 'Nova Usina',
    path: '/dashboard/admin/plants',
    icon: Zap,
    color: 'text-brand-green bg-brand-green/10',
  },
  {
    label: 'Nova Fatura',
    path: '/dashboard/admin/finance',
    icon: FileText,
    color: 'text-brand-orange bg-brand-orange/10',
  },
  {
    label: 'Novo Contrato',
    path: '/dashboard/admin/contratos',
    icon: FileSignature,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
  },
  {
    label: 'Novo Lead',
    path: '/dashboard/admin/crm',
    icon: TrendingUp,
    color: 'text-brand-blue bg-brand-blue/10',
  },
  {
    label: 'Novo Chamado',
    path: '/dashboard/admin/suporte',
    icon: LifeBuoy,
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  },
  {
    label: 'Importar Faturas',
    path: '/dashboard/admin/finance',
    icon: Upload,
    color: 'text-brand-yellow bg-brand-yellow/10',
  },
  {
    label: 'Importar Geração',
    path: '/dashboard/admin/finance',
    icon: Download,
    color: 'text-brand-green bg-brand-green/10',
  },
]

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
      {actions.map((a) => (
        <Link key={a.label} to={a.path}>
          <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center gap-2 p-3 text-center">
              <div className={`rounded-xl p-2.5 ${a.color}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium leading-tight">{a.label}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
