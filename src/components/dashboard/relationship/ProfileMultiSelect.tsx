import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Users } from 'lucide-react'
import { PROFILE_OPTIONS } from '@/lib/constants'

interface ProfileMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  disabled?: boolean
}

export function ProfileMultiSelect({
  value,
  onChange,
  label = 'Perfis na ACERSOL',
  disabled = false,
}: ProfileMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const toggle = (profile: string) => {
    if (value.includes(profile)) {
      onChange(value.filter((p) => p !== profile))
    } else {
      onChange([...value, profile])
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
            disabled={disabled}
            role="combobox"
          >
            <span className="flex items-center gap-2 truncate">
              <Users className="h-4 w-4 text-muted-foreground" />
              {value.length > 0
                ? `${value.length} perfil(is) selecionado(s)`
                : 'Selecione os perfis'}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
          <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
            {PROFILE_OPTIONS.map((profile) => (
              <label
                key={profile}
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent text-sm"
              >
                <Checkbox
                  checked={value.includes(profile)}
                  onCheckedChange={() => toggle(profile)}
                />
                {profile}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {value.map((p) => (
            <Badge key={p} variant="secondary" className="text-xs">
              {p}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
