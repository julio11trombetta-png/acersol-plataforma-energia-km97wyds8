import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

export default function PasswordRecovery() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Digite um e-mail válido')
      return
    }
    setLoading(true)
    try {
      await pb.collection('users').requestPasswordReset(email)
      setSent(true)
      toast.success('Instruções enviadas para seu e-mail!')
    } catch {
      toast.error('Não foi possível enviar o e-mail. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="flex justify-center">
          <Logo showText={false} />
        </div>
        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
            <CardDescription>
              {sent
                ? 'Verifique seu e-mail para as instruções de recuperação.'
                : 'Digite seu e-mail cadastrado para receber as instruções de recuperação de senha.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-3 py-4">
                  <CheckCircle2 className="h-16 w-16 text-brand-green" />
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Se o e-mail <strong className="text-foreground">{email}</strong> estiver
                    cadastrado, você receberá um link para redefinir sua senha em instantes.
                  </p>
                </div>
                <Button
                  className="w-full rounded-full bg-brand-blue hover:bg-blue-800 text-white shadow-md"
                  onClick={() => navigate('/login')}
                >
                  Voltar para o Login
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="recovery-email">E-mail Cadastrado</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-brand-blue hover:bg-blue-800 text-white shadow-md transition-transform active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Instruções'
                  )}
                </Button>
                <Link
                  to="/login"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Voltar para o Login
                  </span>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
