import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { KeyRound, ShieldAlert, RotateCcw, ShieldCheck, UserCog } from 'lucide-react'
import { adminResetPassword, adminForcePasswordChange, getUserByDocument } from '@/services/users'
import { PasswordLogsViewer } from '@/components/dashboard/PasswordLogsViewer'

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
  const [userStatus, setUserStatus] = useState<any>(null)
  const [statusLoading, setStatusLoading] = useState(true)

  const fetchUserStatus = async () => {
    if (!documentNumber) {
      setStatusLoading(false)
      return
    }
    try {
      const status = await getUserByDocument(documentNumber)
      setUserStatus(status)
    } catch {
      setUserStatus(null)
    } finally {
      setStatusLoading(false)
    }
  }

  useEffect(() => {
    fetchUserStatus()
  }, [documentNumber])

  const handleReset = async () => {
    setLoading(true)
    try {
      await adminResetPassword(documentNumber)
      toast.success(
        'Senha redefinida para o documento padrão. O usuário deverá alterá-la no próximo acesso.',
      )
      setResetDialogOpen(false)
      fetchUserStatus()
    } catch {
      toast.error('Erro ao redefinir senha. Verifique se o usuário já possui conta cadastrada.')
    } finally {
      setLoading(false)
    }
  }

  const handleForceToggle = async () => {
    setLoading(true)
    try {
      const newValue = !userStatus?.force_password_change
      await adminForcePasswordChange(documentNumber, newValue)
      toast.success(
        newValue
          ? 'Usuário obrigado a alterar a senha no próximo acesso.'
          : 'Obrigação de troca de senha removida.',
      )
      setForceDialogOpen(false)
      fetchUserStatus()
    } catch {
      toast.error('Erro ao alterar status de troca de senha.')
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

  const isForceActive = userStatus?.force_password_change === true

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
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Documento vinculado</p>
            <p className="text-sm text-muted-foreground font-mono">{documentNumber}</p>
          </div>
          {statusLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : userStatus?.exists ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Usuário</p>
                <p className="text-sm text-muted-foreground">
                  {userStatus.name || userStatus.email}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Status de troca obrigatória</p>
                {isForceActive ? (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <ShieldAlert className="mr-1 h-3 w-3" /> Ativo
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20"
                  >
                    <ShieldCheck className="mr-1 h-3 w-3" /> Em dia
                  </Badge>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCog className="h-4 w-4" />
              Nenhuma conta de usuário vinculada a este documento.
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setResetDialogOpen(true)}
            disabled={loading || !userStatus?.exists}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Redefinir para Padrão
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setForceDialogOpen(true)}
            disabled={loading || !userStatus?.exists}
          >
            {isForceActive ? (
              <ShieldCheck className="mr-2 h-4 w-4" />
            ) : (
              <ShieldAlert className="mr-2 h-4 w-4" />
            )}
            {isForceActive ? 'Remover Obrigação' : 'Forçar Troca de Senha'}
          </Button>
        </div>

        {userStatus?.exists && userStatus?.id && <PasswordLogsViewer userId={userStatus.id} />}

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
              <AlertDialogTitle>
                {isForceActive ? 'Remover Obrigação de Troca de Senha' : 'Forçar Troca de Senha'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isForceActive
                  ? 'A obrigação de troca de senha será removida. O usuário poderá acessar o sistema normalmente sem alterar a senha. Deseja continuar?'
                  : 'O usuário será obrigado a alterar a senha no próximo acesso à plataforma. Deseja continuar?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-full bg-brand-blue hover:bg-blue-800 text-white"
                onClick={handleForceToggle}
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
