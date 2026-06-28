import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth, type UserRole } from '@/stores/use-auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormFieldsProps {
  submitLabel?: string
  buttonClassName?: string
  showForgotLink?: boolean
  expectedRole?: UserRole
  footer?: ReactNode
}

export function LoginFormFields({
  submitLabel = 'Entrar',
  buttonClassName,
  showForgotLink = true,
  expectedRole,
  footer,
}: LoginFormFieldsProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errors.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Formato de e-mail inválido'
    }
    if (!password) {
      errors.password = 'Senha é obrigatória'
    } else if (password.length < 8) {
      errors.password = 'A senha deve ter no mínimo 8 caracteres'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    const { error } = await signIn(email, password, expectedRole)
    if (error) {
      toast.error(error)
      setIsSubmitting(false)
    } else {
      toast.success('Login realizado com sucesso! Redirecionando...')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
          }}
          disabled={isSubmitting}
          required
        />
        {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          {showForgotLink && (
            <a href="#" className="text-sm font-medium text-brand-blue hover:underline">
              Esqueceu?
            </a>
          )}
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
            }}
            disabled={isSubmitting}
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
        {fieldErrors.password && <p className="text-sm text-red-500">{fieldErrors.password}</p>}
      </div>
      <Button
        type="submit"
        className={cn(
          'w-full rounded-full shadow-md transition-transform active:scale-[0.98]',
          buttonClassName,
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          submitLabel
        )}
      </Button>
      {footer}
    </form>
  )
}
