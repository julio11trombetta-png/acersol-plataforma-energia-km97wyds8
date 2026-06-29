import { type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Label className="text-sm font-medium">
      {label}
      {required && <span className="text-red-500 ml-0.5"> *</span>}
    </Label>
  )
}

export function FieldError({ error }: { error?: string }) {
  if (!error) return null
  return <p className="text-xs text-red-500 mt-1">{error}</p>
}

export function FieldWrapper({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <FieldLabel label={label} required={required} />
      {children}
      <FieldError error={error} />
    </div>
  )
}

export const DEFAULT_SEARCH_FIELDS = [
  'name',
  'company',
  'document_number',
  'cnpj',
  'cpf',
  'phone',
  'whatsapp',
  'email',
  'friendly_code',
  'uuid',
  'city',
  'state',
  'associateStatus',
  'status',
]

export function handleModalAutoFocus(e: Event) {
  e.preventDefault()
  const content = e.currentTarget as HTMLElement
  const firstInput = content.querySelector<HTMLElement>(
    'input:not([disabled]):not([type="hidden"]), textarea:not([disabled])',
  )
  if (firstInput) setTimeout(() => firstInput.focus(), 0)
}
