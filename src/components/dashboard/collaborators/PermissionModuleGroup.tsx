import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, Check, Circle } from 'lucide-react'
import type { PermissionModuleConfig } from '@/lib/permission-modules'

interface PermissionModuleGroupProps {
  module: PermissionModuleConfig
  selectedPerms: string[]
  inheritedPerms: Set<string>
  onToggle: (key: string) => void
  onToggleModule: (keys: string[], select: boolean) => void
}

export function PermissionModuleGroup({
  module,
  selectedPerms,
  inheritedPerms,
  onToggle,
  onToggleModule,
}: PermissionModuleGroupProps) {
  const [expanded, setExpanded] = useState(true)
  const moduleKeys = module.permissions.map((p) => p.key)
  const selectedCount = moduleKeys.filter((k) => selectedPerms.includes(k)).length

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-muted/30">
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {module.name}
          <Badge variant="secondary" className="text-xs ml-1">
            {selectedCount}/{module.permissions.length}
          </Badge>
        </button>
        {expanded && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-xs"
              onClick={() => onToggleModule(moduleKeys, true)}
            >
              Marcar módulo
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-xs"
              onClick={() => onToggleModule(moduleKeys, false)}
            >
              Desmarcar módulo
            </Button>
          </div>
        )}
      </div>
      {expanded && (
        <div className="p-2 space-y-1">
          {module.permissions.map((p) => {
            const isSelected = selectedPerms.includes(p.key)
            const isInherited = inheritedPerms.has(p.key)
            return (
              <label
                key={p.key}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/40 cursor-pointer text-sm"
                title={p.description}
              >
                <Checkbox checked={isSelected} onCheckedChange={() => onToggle(p.key)} />
                {isSelected ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={isSelected ? 'font-medium' : 'text-muted-foreground'}>
                  {p.label}
                </span>
                {isInherited && !isSelected && (
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                    Herdada
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">{p.description}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
