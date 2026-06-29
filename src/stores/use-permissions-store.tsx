import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from '@/stores/use-auth-store'
import { resolveUserPermissions } from '@/services/permissions'

interface PermissionsContextType {
  permissions: string[]
  loading: boolean
  hasPerm: (perm: string) => boolean
  hasAny: (perms: string[]) => boolean
  refresh: () => Promise<void>
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadPermissions = async () => {
    if (!user) {
      setPermissions([])
      setLoading(false)
      return
    }
    try {
      const perms = await resolveUserPermissions(user.id)
      if (user.role === 'admin') {
        setPermissions([
          ...new Set([...perms, 'VISUALIZAR', 'CADASTRAR', 'EDITAR', 'EXCLUIR_LOGICA']),
        ])
      } else {
        setPermissions(perms)
      }
    } catch {
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) loadPermissions()
    else {
      setPermissions([])
      setLoading(false)
    }
  }, [isAuthenticated, user?.id])

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        loading,
        hasPerm: (p) => permissions.includes(p),
        hasAny: (ps) => ps.some((p) => permissions.includes(p)),
        refresh: loadPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext)
  if (!ctx) throw new Error('usePermissions must be used within PermissionsProvider')
  return ctx
}
