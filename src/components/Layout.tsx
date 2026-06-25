import { Link, Outlet, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { ThemeToggle } from './ThemeToggle'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet'
import { useEffect } from 'react'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const links = [
    { label: 'Início', href: '/' },
    { label: 'Para Clientes', href: '/clientes' },
    { label: 'Para Usinas', href: '/usinas' },
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contato' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden lg:flex gap-6 items-center">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              asChild
              className="hidden sm:flex bg-brand-blue hover:bg-blue-800 text-white rounded-full transition-transform active:scale-95 shadow-md shadow-brand-blue/20"
            >
              <Link to="/login">Área do Cliente</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-6">
                  {links.map((link) => (
                    <Link key={link.label} to={link.href} className="text-sm font-medium">
                      {link.label}
                    </Link>
                  ))}
                  <Button asChild className="w-full bg-brand-blue text-white rounded-full">
                    <Link to="/login">Área do Cliente</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-brand-dark py-12 text-white/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/20 to-transparent pointer-events-none"></div>
        <div className="container relative z-10 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo className="[&_span]:text-white" />
            <p className="text-sm text-white/60">
              Conectando você às melhores usinas de energia renovável com tecnologia premium.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/clientes" className="hover:text-white transition-colors">
                  Para Clientes
                </Link>
              </li>
              <li>
                <Link to="/usinas" className="hover:text-white transition-colors">
                  Para Usinas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
