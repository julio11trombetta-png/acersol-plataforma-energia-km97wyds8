import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { SidebarGroupConfig } from '@/lib/sidebar-config'

export function SidebarNav({ groups }: { groups: SidebarGroupConfig[] }) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/dashboard/admin' || path === '/dashboard/admin/associacao') {
      return location.pathname === path
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isChildActive = (children: { path: string }[]) =>
    children.some((c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/'))

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) =>
                item.children ? (
                  <Collapsible key={item.path} defaultOpen={isChildActive(item.children)}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.name}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.path}>
                              <SidebarMenuSubButton asChild isActive={isActive(child.path)}>
                                <Link to={child.path}>
                                  <child.icon className="w-3 h-3" />
                                  <span>{child.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.name}>
                      <Link to={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
