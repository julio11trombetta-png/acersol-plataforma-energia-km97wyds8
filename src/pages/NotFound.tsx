import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Logo } from '@/components/Logo'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Logo showText={false} />
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Página não encontrada</p>
        <a
          href="/login"
          className="inline-flex items-center text-brand-blue hover:text-blue-700 underline font-medium"
        >
          Voltar para o Login
        </a>
      </div>
    </div>
  )
}

export default NotFound
