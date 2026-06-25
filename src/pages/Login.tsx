import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/stores/use-auth-store'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building, User, ShieldAlert } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (role: 'client' | 'owner' | 'admin') => {
    setIsLoading(true)
    setTimeout(() => {
      login(role)
      navigate(`/dashboard/${role}`)
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex md:w-1/2 bg-brand-dark p-12 flex-col justify-between relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.usecurling.com/p/800/1200?q=modern%20solar%20panel&color=black"
            alt="Solar Energy"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/30 to-transparent"></div>
        </div>
        <div className="relative z-10">
          <Logo className="text-white [&>span]:text-white" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md mb-4 animate-fade-in shadow-lg">
            <ShieldAlert className="mr-2 h-4 w-4" /> Acesso Protegido
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-fade-in-up">
            Gestão inteligente para o futuro da energia.
          </h1>
          <p
            className="text-lg text-white/70 animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Acesse seu painel executivo para acompanhar sua economia e produção em tempo real, com a
            tecnologia mais avançada do setor.
          </p>
        </div>
        <div
          className="relative z-10 text-sm text-white/50 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          © {new Date().getFullYear()} ACERSOL Plataforma Energia
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="md:hidden flex justify-center mb-8">
            <Logo />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo</h2>
            <p className="text-muted-foreground">Escolha seu perfil para acessar a plataforma</p>
          </div>

          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
              <TabsTrigger value="client" className="h-full">
                <User className="mr-2 h-4 w-4 hidden sm:block" /> Cliente
              </TabsTrigger>
              <TabsTrigger value="owner" className="h-full">
                <Building className="mr-2 h-4 w-4 hidden sm:block" /> Usina
              </TabsTrigger>
              <TabsTrigger value="admin" className="h-full">
                <ShieldAlert className="mr-2 h-4 w-4 hidden sm:block" /> Admin
              </TabsTrigger>
            </TabsList>

            {(['client', 'owner', 'admin'] as const).map((role) => (
              <TabsContent key={role} value={role}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Login {role === 'admin' ? 'Admin' : role === 'owner' ? 'Usina' : 'Cliente'}
                    </CardTitle>
                    <CardDescription>
                      Insira suas credenciais para acessar sua conta.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>E-mail ou Documento</Label>
                      <Input placeholder="Seu acesso..." />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Senha</Label>
                        <a href="#" className="text-sm font-medium text-brand-blue hover:underline">
                          Esqueceu?
                        </a>
                      </div>
                      <Input type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-brand-blue hover:bg-blue-800 text-white rounded-full transition-transform active:scale-[0.98] shadow-md"
                      onClick={() => handleLogin(role)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Autenticando...' : 'Entrar na Plataforma'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
