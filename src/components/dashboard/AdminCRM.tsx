import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const columns = [
  {
    title: 'Novos Leads',
    count: 12,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Em Contato',
    count: 8,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    title: 'Proposta',
    count: 4,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    title: 'Assinado',
    count: 2,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
]

export function AdminCRM() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {columns.map((col, idx) => (
        <div key={idx} className="flex flex-col gap-3 min-w-[250px]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{col.title}</h3>
            <Badge variant="secondary" className={col.color}>
              {col.count}
            </Badge>
          </div>

          {/* Mock Cards */}
          {[1, 2, 3].map((card) => (
            <Card
              key={card}
              className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Empresa {card * (idx + 1)} Ltda</span>
                    <span className="text-xs text-muted-foreground">CNPJ: 00.000...</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-[10px]">
                    Residencial
                  </Badge>
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${idx * card}`}
                    />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          ))}
          {idx === 0 && (
            <div className="text-xs text-center text-muted-foreground p-2 border border-dashed rounded-lg">
              +9 cards ocultos
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
