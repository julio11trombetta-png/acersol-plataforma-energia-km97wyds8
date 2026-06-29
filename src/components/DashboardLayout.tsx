import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { GlobalSearch } from './GlobalSearch'
import { IAFloatingWidget } from './IAFloatingWidget'
import { useAuth } from '@/stores/use-auth-store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Bell, Menu, UserCircle, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { SidebarNav } from './SidebarNav'
import { sidebarGroups } from '@/lib/sidebar-config'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  const isDesktopAdmin = user.role === 'admin'

  const header = (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur flex h-16 items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        {isDesktopAdmin ? (
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-2" />
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex gap-2 text-muted-foreground"
              onClick={() => {
                const el = document.querySelector('[cmdk-input]') as HTMLInputElement
                el?.focus()
              }}
            >
              <Search className="h-4 w-4" /> <span className="text-xs">Buscar... ⌘K</span>
            </Button>
          </div>
        ) : (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px]">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="py-4">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-2 mt-4">
                  <Link
                    to={`/dashboard/${user.role}`}
                    className="px-3 py-2 text-sm font-medium bg-secondary rounded-lg"
                  >
                    Dashboard
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Logo className="hidden md:block" />
            <div className="hidden md:flex ml-8 items-center rounded-md bg-muted px-3 py-1 text-sm font-medium border">
              Portal {user.role === 'owner' ? 'Usina' : 'Cliente'}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => toast.info('Você não tem novas notificações')}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-9 w-9 rounded-full overflow-hidden border">
              <Avatar className="h-full w-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info('Configurações em breve')}>
              <UserCircle className="mr-2 h-4 w-4" /> Conta
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )

  const main = (
    <main className="flex-1 container py-8 max-w-7xl mx-auto">
      <Outlet />
    </main>
  )

  if (isDesktopAdmin) {
    return (
      <SidebarProvider>
        <GlobalSearch />
        <Sidebar>
          <SidebarHeader className="p-4 pt-6 border-b">
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav groups={sidebarGroups} />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-h-screen bg-muted/20">
          {header}
          {main}
        </SidebarInset>
        <IAFloatingWidget />
      </SidebarProvider>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {header}
      {main}
    </div>
  )
}
