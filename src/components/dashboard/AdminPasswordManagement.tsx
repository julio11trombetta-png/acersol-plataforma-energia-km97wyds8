import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { KeyRound, ShieldAlert, RotateCcw } from 'lucide-react'
import { adminResetPassword, adminForcePasswordChange } from '@/services/users'

interface AdminPasswordManagementProps {
  documentNumber: string
  entityName: string
}

export function AdminPasswordManagement({
  documentNumber,
  entityName,
}: AdminPasswordManagementProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [forceDialogOpen, setForceDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    setLoading(true)
    try {
      await adminResetPassword(documentNumber)
      toast.success(
        'Senha redefinida para o documento padrão. O usuário deverá alterá-la no próximo acesso.',
      )
      setResetDialogOpen(false)
    } catch {
      toast.error('Erro ao redefinir senha. Verifique se o usuário já possui conta cadastrada.')
    } finally {
      setLoading(false)
    }
  }

  const handleForce = async () => {
    setLoading(true)
    try {
      await adminForcePasswordChange(documentNumber, true)
      toast.success('Usuário obrigado a alterar a senha no próximo acesso.')
      setForceDialogOpen(false)
    } catch {
      toast.error('Erro ao forçar alteração de senha. Verifique se o usuário já possui conta.')
    } finally {
      setLoading(false)
    }
  }

  if (!documentNumber) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
            Gerenciamento de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            É necessário cadastrar um CPF ou CNPJ para gerenciar as credenciais de acesso deste
            usuário.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-brand-blue" />
          Gerenciamento de Acesso
        </CardTitle>
        <CardDescription>
          Controle as credenciais de acesso do usuário vinculado a {entityName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4 space-y-1">
          <p className="text-sm font-medium">Documento vinculado</p>
          <p className="text-sm text-muted-foreground font-mono">{documentNumber}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setResetDialogOpen(true)}
            disabled={loading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Redefinir para Padrão
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setForceDialogOpen(true)}
            disabled={loading}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            Forçar Troca de Senha
          </Button>
        </div>

        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Redefinição de Senha</AlertDialogTitle>
              <AlertDialogDescription>
                A senha do usuário será redefinida para o documento (CPF/CNPJ) cadastrado. O usuário
                será obrigado a definir uma nova senha no próximo acesso. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-full bg-brand-blue hover:bg-blue-800 text-white"
                onClick={handleReset}
                disabled={loading}
              >
                Confirmar Redefinição
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={forceDialogOpen} onOpenChange={setForceDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Forçar Troca de Senha</AlertDialogTitle>
              <AlertDialogDescription>
                O usuário será obrigado a alterar a senha no próximo acesso à plataforma. Deseja
                continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-full bg-brand-blue hover:bg-blue-800 text-white"
                onClick={handleForce}
                disabled={loading}
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
