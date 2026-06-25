import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '@/stores/use-auth-store'
import { Button } from '@/components/ui/button'
import {
  LogOut,
  Bell,
  Menu,
  UserCircle,
  LayoutDashboard,
  Users,
  Zap,
  DollarSign,
  Settings,
} from 'lucide-react'
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Clientes', path: '/dashboard/admin/clients', icon: Users },
    { name: 'Usinas', path: '/dashboard/admin/plants', icon: Zap },
    { name: 'Financeiro', path: '/dashboard/admin/finance', icon: DollarSign },
    { name: 'Configurações', path: '/dashboard/admin/settings', icon: Settings },
  ]

  const isDesktopAdmin = user.role === 'admin'

  const content = (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          {!isDesktopAdmin && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px]">
                <SheetTitle className="sr-only">Menu Dashboard</SheetTitle>
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
          )}

          {isDesktopAdmin ? (
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-2" />
              <div className="hidden md:flex ml-2 items-center rounded-md bg-muted px-3 py-1 text-sm font-medium border">
                Portal Admin
              </div>
            </div>
          ) : (
            <>
              <Link to="/" className="hidden md:block">
                <Logo />
              </Link>
              <div className="hidden md:flex ml-8 items-center rounded-md bg-muted px-3 py-1 text-sm font-medium border">
                Portal {user.role === 'owner' ? 'Usina' : 'Cliente'}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full overflow-hidden border"
              >
                <img src={user.avatar} alt={user.name} className="object-cover" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" /> Conta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className={cn('flex-1 container py-8', isDesktopAdmin ? 'max-w-6xl mx-auto' : '')}>
        <Outlet />
      </main>
    </>
  )

  if (isDesktopAdmin) {
    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4 pt-6 border-b">
            <Link to="/">
              <Logo />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminLinks.map((link) => {
                    const isActive =
                      link.path === '/dashboard/admin'
                        ? location.pathname === link.path
                        : location.pathname.startsWith(link.path)
                    return (
                      <SidebarMenuItem key={link.path}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={link.name}>
                          <Link to={link.path}>
                            <link.icon className="w-5 h-5" />
                            <span>{link.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-h-screen bg-muted/20">{content}</SidebarInset>
      </SidebarProvider>
    )
  }

  return <div className="min-h-screen bg-muted/20 flex flex-col">{content}</div>
}
