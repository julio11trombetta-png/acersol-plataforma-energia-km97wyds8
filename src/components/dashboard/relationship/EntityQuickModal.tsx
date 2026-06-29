import { ClientQuickModal } from './ClientQuickModal'
import { PlantQuickModal } from './PlantQuickModal'
import { LeadQuickModal } from './LeadQuickModal'

const MODAL_MAP: Record<string, React.ComponentType<any>> = {
  clients: ClientQuickModal,
  plants: PlantQuickModal,
  crm_leads: LeadQuickModal,
}

export interface EntityQuickModalProps {
  collection: string
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: any | null
  readOnly?: boolean
  onSaved: (record: any) => void
}

export function EntityQuickModal({
  collection,
  open,
  onOpenChange,
  editing,
  readOnly,
  onSaved,
}: EntityQuickModalProps) {
  const Modal = MODAL_MAP[collection]
  if (!Modal) return null
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      editing={editing}
      readOnly={readOnly}
      onSaved={onSaved}
    />
  )
}
