import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, KeyRound, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

export default function FirstAccess() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [document, setDocument] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Digite um e-mail válido')
      return
    }
    const digits = document.replace(/\D/g, '')
    if (digits.length !== 11 && digits.length !== 14) {
      toast.error('Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos')
      return
    }
    if (newPassword.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    setLoading(true)
    try {
      await pb.collection('users').requestPasswordReset(email)
      setSuccess(true)
      toast.success('Solicitação enviada! Verifique seu e-mail para ativar sua conta.')
    } catch {
      toast.error('Não foi possível processar sua solicitação. Verifique seus dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-[480px] space-y-6">
        <div className="flex justify-center">
          <Logo showText={false} />
        </div>
        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10">
              <KeyRound className="h-6 w-6 text-brand-green" />
            </div>
            <CardTitle className="text-2xl">Primeiro Acesso</CardTitle>
            <CardDescription>
              {success
                ? 'Sua solicitação foi processada com sucesso.'
                : 'Cadastre sua senha de acesso para começar a usar a plataforma.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-3 py-4">
                  <CheckCircle2 className="h-16 w-16 text-brand-green" />
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Enviamos um link de confirmação para{' '}
                    <strong className="text-foreground">{email}</strong>. Siga as instruções no
                    e-mail para definir sua senha e acessar o portal.
                  </p>
                </div>
                <Button
                  className="w-full rounded-full bg-brand-blue hover:bg-blue-800 text-white shadow-md"
                  onClick={() => navigate('/login')}
                >
                  Ir para o Login
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="fa-email">E-mail</Label>
                  <Input
                    id="fa-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fa-document">CPF ou CNPJ</Label>
                  <Input
                    id="fa-document"
                    type="text"
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    value={document}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, '').slice(0, 14)
                      if (d.length <= 11) {
                        setDocument(
                          d
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1-$2'),
                        )
                      } else {
                        setDocument(
                          d
                            .replace(/(\d{2})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1/$2')
                            .replace(/(\d{4})(\d)/, '$1-$2'),
                        )
                      }
                    }}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fa-password">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="fa-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fa-confirm">Confirmar Senha</Label>
                  <Input
                    id="fa-confirm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-brand-green hover:bg-green-700 text-white shadow-md transition-transform active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Cadastrar Acesso'
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
