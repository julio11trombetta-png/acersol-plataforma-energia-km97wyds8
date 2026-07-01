import { BudgetStepper } from '@/components/dashboard/budgets/BudgetStepper'

export default function BudgetCreatePage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Novo Orçamento</h2>
        <p className="text-muted-foreground">
          Crie uma proposta de economia de energia em 5 etapas.
        </p>
      </div>
      <BudgetStepper />
    </div>
  )
}
