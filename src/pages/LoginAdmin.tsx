import { ShieldAlert } from 'lucide-react'
import { LoginPortal } from '@/components/auth/LoginPortal'

export default function LoginAdmin() {
  return (
    <LoginPortal
      variant="minimal"
      title="Painel Administrativo"
      description="Acesso restrito ao back-office ACERSOL"
      badgeText="Acesso Protegido"
      badgeIcon={ShieldAlert}
      submitLabel="Acessar Painel"
      expectedRole="admin"
    />
  )
}
