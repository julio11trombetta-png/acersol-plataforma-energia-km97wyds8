import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ClientResponseError } from 'pocketbase'
import pb from '@/lib/pocketbase/client'

export type UserRole = 'client' | 'owner' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  force_password_change: boolean
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  signIn: (
    email: string,
    password: string,
    expectedRole?: UserRole,
  ) => Promise<{ error: string | null }>
  signOut: () => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapRecord(record: any): User | null {
  if (!record) return null
  return {
    id: record.id,
    name: record.name || record.email || '',
    email: record.email || '',
    role: (record.role as UserRole) || 'client',
    avatar: record.avatar ? pb.files.getUrl(record, record.avatar) : undefined,
    force_password_change: record.force_password_change ?? false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(
    pb.authStore.isValid ? mapRecord(pb.authStore.record) : null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? mapRecord(record) : null)
      setIsAuthenticated(pb.authStore.isValid)
    })

    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => pb.authStore.clear())
        .finally(() => setLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, expectedRole?: UserRole) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      const record = pb.authStore.record
      if (expectedRole && (record?.role as UserRole) !== expectedRole) {
        pb.authStore.clear()
        setUser(null)
        setIsAuthenticated(false)
        const roleLabels: Record<UserRole, string> = {
          admin: 'administrador',
          owner: 'proprietário de usina',
          client: 'cliente',
        }
        return {
          error: `Acesso negado. Este portal é exclusivo para usuários com perfil de ${roleLabels[expectedRole]}.`,
        }
      }
      return { error: null }
    } catch (err) {
      if (err instanceof ClientResponseError && (err.status === 400 || err.status === 404)) {
        return { error: 'Credenciais inválidas. Verifique seus dados e senha.' }
      }
      return { error: 'Erro ao tentar autenticar. Tente novamente.' }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    setUser(null)
    setIsAuthenticated(false)
  }

  const refreshUser = async () => {
    try {
      await pb.collection('users').authRefresh()
    } catch {
      // ignore refresh errors
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signIn, signOut, logout: signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
