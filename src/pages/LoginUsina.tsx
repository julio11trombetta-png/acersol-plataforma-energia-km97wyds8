import { Factory } from 'lucide-react'
import { LoginPortal } from '@/components/auth/LoginPortal'

export default function LoginUsina() {
  return (
    <LoginPortal
      variant="branded"
      title="Painel da Usina"
      description="Monitore a produção e desempenho das suas usinas"
      badgeText="Produção de Energia"
      badgeIcon={Factory}
      imageUrl="https://img.usecurling.com/p/800/1200?q=solar%20farm%20panels&color=blue&dpr=2"
      heroTitle="Gestão inteligente da sua geração solar."
      heroDescription="Acompanhe a produção, capacidade e status das suas usinas em tempo real."
      submitLabel="Entrar na Plataforma"
      buttonClassName="bg-brand-blue hover:bg-blue-800 text-white"
      expectedRole="owner"
    />
  )
}
