import { createContext, useContext, useState, ReactNode } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: 'client' | 'owner' | 'admin'
  avatar?: string
}

type AuthContextType = {
  user: User | null
  login: (role: 'client' | 'owner' | 'admin') => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (role: 'client' | 'owner' | 'admin') => {
    setUser({
      id: '1',
      name:
        role === 'admin'
          ? 'Administrador'
          : role === 'owner'
            ? 'Proprietário Usina'
            : 'Cliente João',
      email: `${role}@acersol.com`,
      role,
      avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${role}`,
    })
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
