import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <Settings className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-sm text-muted-foreground">
            Backup, segurança e preferências do sistema
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-brand-green" /> Segurança
            </CardTitle>
            <CardDescription>Políticas de acesso e auditoria do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Autenticação obrigatória em todos os módulos</p>
            <p>• RBAC baseado em roles (admin, owner, client)</p>
            <p>• Logs de atividade registrados automaticamente</p>
            <p>• Validação de documentos (CPF/CNPJ) no backend</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
