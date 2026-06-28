import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { type LucideIcon, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/stores/use-auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Logo } from '@/components/Logo'
import { LoginFormFields } from './LoginFormFields'

interface LoginPortalProps {
  variant: 'branded' | 'minimal'
  title: string
  description: string
  badgeIcon: LucideIcon
  badgeText?: string
  imageUrl?: string
  heroTitle?: string
  heroDescription?: string
  submitLabel?: string
  buttonClassName?: string
  expectedRole?: 'client' | 'owner' | 'admin'
}

export function LoginPortal({
  variant,
  title,
  description,
  badgeIcon: BadgeIcon,
  badgeText,
  imageUrl,
  heroTitle,
  heroDescription,
  submitLabel,
  buttonClassName,
  expectedRole,
}: LoginPortalProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate(`/dashboard/${user.role}`, { replace: true })
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-[400px] space-y-6">
          <Skeleton className="h-10 w-32 mx-auto" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <Card className="border-border/60 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BadgeIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <LoginFormFields
                  submitLabel={submitLabel}
                  showForgotLink={false}
                  expectedRole={expectedRole}
                />
                <Link
                  to="/"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Voltar para o site
                  </span>
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex md:w-1/2 bg-brand-dark p-12 flex-col justify-between relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />
        </div>
        <div className="relative z-10">
          <Logo className="text-white [&>span]:text-white" />
        </div>
        <div className="relative z-10 space-y-6">
          {badgeText && (
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md mb-4 animate-fade-in shadow-lg">
              <BadgeIcon className="mr-2 h-4 w-4" /> {badgeText}
            </div>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-fade-in-up">
            {heroTitle}
          </h1>
          <p
            className="text-lg text-white/70 animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            {heroDescription}
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
          <div className="md:hidden flex justify-center">
            <Logo />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Card className="border-border/60 shadow-lg">
            <CardContent className="pt-6">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <LoginFormFields
                  submitLabel={submitLabel ?? 'Entrar na Plataforma'}
                  buttonClassName={buttonClassName}
                  expectedRole={expectedRole}
                />
                <Link
                  to="/"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Voltar para o site
                  </span>
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
