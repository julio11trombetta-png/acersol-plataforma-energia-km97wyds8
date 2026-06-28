import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/clientes', label: 'Para Clientes' },
  { to: '/usinas', label: 'Para Usinas' },
  { to: '/faq', label: 'FAQ' },
  { to: '/blog', label: 'Blog' },
  { to: '/contato', label: 'Contato' },
]

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === link.to ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.to
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t mt-3">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Logo />
              <p className="text-xs text-muted-foreground">
                Plataforma de gestão de energia solar compartilhada
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ACERSOL Plataforma Energia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
