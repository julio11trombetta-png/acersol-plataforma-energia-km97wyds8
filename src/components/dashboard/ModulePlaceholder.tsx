import { type LucideIcon, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ModulePlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  features?: string[]
}

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  features = [],
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Card className="border-dashed">
        <CardContent className="p-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-brand-blue/5 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-brand-blue/40" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Módulo em Preparação</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Este módulo está sendo desenvolvido com a padronização completa do ERP ACERSOL: busca
              avançada, filtros, tabela responsiva, paginação e exportação.
            </p>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {features.map((f) => (
                <Badge key={f} variant="secondary" className="bg-muted/50">
                  {f}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
