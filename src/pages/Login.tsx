import { Link } from 'react-router-dom'
import { User, Building, ShieldAlert, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Card } from '@/components/ui/card'

const portals = [
  {
    to: '/cliente',
    title: 'Cliente',
    description: 'Acompanhe seu consumo e economia com energia solar',
    icon: User,
    color: 'from-green-500 to-emerald-600',
  },
  {
    to: '/usina',
    title: 'Usina',
    description: 'Gestão de produção para proprietários de usinas',
    icon: Building,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    to: '/admin',
    title: 'Administrador',
    description: 'Back-office para gestão completa da plataforma',
    icon: ShieldAlert,
    color: 'from-slate-600 to-slate-800',
  },
]

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-background p-6">
      <div className="w-full max-w-4xl space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Escolha seu portal de acesso</h1>
            <p className="text-muted-foreground">
              Selecione o perfil correspondente para entrar na plataforma
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {portals.map((portal) => (
            <Link key={portal.to} to={portal.to}>
              <Card className="group h-full p-6 cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${portal.color} mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <portal.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">{portal.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{portal.description}</p>
                <div className="inline-flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all">
                  Acessar <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  )
}
