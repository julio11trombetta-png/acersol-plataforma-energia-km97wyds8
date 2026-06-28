import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

type UserRole = 'client' | 'owner' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => void
  logout: () => void
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

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch {
      return { error: 'Email ou senha inválidos' }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signIn, signOut, logout: signOut }}
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
