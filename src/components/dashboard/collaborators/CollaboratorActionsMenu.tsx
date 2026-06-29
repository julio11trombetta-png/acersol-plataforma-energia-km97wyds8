import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Pencil, Shield, KeyRound, Lock, Unlock, UserX, Trash2 } from 'lucide-react'

interface CollaboratorActionsMenuProps {
  user: any
  onEdit: (user: any) => void
  onPermissions: (user: any) => void
  onResetPassword: (user: any) => void
  onToggleBlock: (user: any) => void
  onDeactivate: (user: any) => void
  onDelete: (user: any) => void
}

export function CollaboratorActionsMenu({
  user,
  onEdit,
  onPermissions,
  onResetPassword,
  onToggleBlock,
  onDeactivate,
  onDelete,
}: CollaboratorActionsMenuProps) {
  const isActive = user.active !== false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pencil className="mr-2 h-3 w-3" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPermissions(user)}>
          <Shield className="mr-2 h-3 w-3" /> Gerenciar Permissões
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onResetPassword(user)}>
          <KeyRound className="mr-2 h-3 w-3" /> Redefinir Senha
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleBlock(user)}>
          {isActive ? (
            <>
              <Lock className="mr-2 h-3 w-3" /> Bloquear
            </>
          ) : (
            <>
              <Unlock className="mr-2 h-3 w-3" /> Desbloquear
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDeactivate(user)}>
          <UserX className="mr-2 h-3 w-3" /> Desativar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-3 w-3" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
