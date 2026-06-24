import { Outlet, Link } from 'react-router-dom'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden selection:bg-brand-blue selection:text-white">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-brand-blue">
              Início
            </Link>
            <a href="#como-funciona" className="transition-colors hover:text-brand-blue">
              Como Funciona
            </a>
            <a href="#beneficios" className="transition-colors hover:text-brand-blue">
              Benefícios
            </a>
            <Link to="/login" className="transition-colors hover:text-brand-blue">
              Para Usinas
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex gap-4">
              <Button
                variant="outline"
                asChild
                className="rounded-full border-brand-blue text-brand-blue hover:bg-brand-blue/10 dark:border-blue-400 dark:text-blue-400"
              >
                <Link to="/login">Área do Cliente</Link>
              </Button>
              <Button className="rounded-full bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90 transition-opacity">
                Quero Economizar
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <div className="flex flex-col gap-6 py-6">
                  <Logo />
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/" className="text-lg font-medium hover:text-brand-blue">
                      Início
                    </Link>
                    <a href="#como-funciona" className="text-lg font-medium hover:text-brand-blue">
                      Como Funciona
                    </a>
                    <Link to="/login" className="text-lg font-medium text-brand-blue mt-4">
                      Login / Área do Cliente
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container py-12 md:py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground mt-4">
                Revolucionando a gestão de energia solar compartilhada no Brasil.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Links Úteis</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-brand-blue">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-blue">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-blue">
                    Dúvidas Frequentes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-brand-blue">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-blue">
                    Política de Privacidade (LGPD)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Assine nossa Newsletter</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button>Assinar</Button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ACERSOL. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
