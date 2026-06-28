import { Leaf } from 'lucide-react'
import { LoginPortal } from '@/components/auth/LoginPortal'

export default function LoginCliente() {
  return (
    <LoginPortal
      variant="branded"
      title="Acesse sua conta"
      description="Acompanhe sua economia e consumo em tempo real"
      badgeText="Energia Sustentável"
      badgeIcon={Leaf}
      imageUrl="https://img.usecurling.com/p/800/1200?q=solar%20panel%20roof&color=green&dpr=2"
      heroTitle="Sua energia limpa, sua economia real."
      heroDescription="Acompanhe em tempo real o quanto você economiza com energia solar compartilhada."
      submitLabel="Entrar na Plataforma"
      buttonClassName="bg-brand-blue hover:bg-blue-800 text-white"
      expectedRole="client"
    />
  )
}
