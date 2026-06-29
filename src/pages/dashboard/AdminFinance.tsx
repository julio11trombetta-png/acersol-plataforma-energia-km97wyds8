import { InvoiceManager } from '@/components/dashboard/InvoiceManager'
import { PlantGenerationManager } from '@/components/dashboard/PlantGenerationManager'
import { ConsumptionManager } from '@/components/dashboard/ConsumptionManager'
import { CashFlowManager } from '@/components/dashboard/CashFlowManager'
import { BankAccountManager } from '@/components/dashboard/BankAccountManager'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DollarSign, Zap, Gauge, Wallet, Landmark } from 'lucide-react'

export default function AdminFinance() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">
          Gestão completa: faturas, geração, consumo, fluxo de caixa e contas bancárias.
        </p>
      </div>
      <Tabs defaultValue="invoices">
        <TabsList className="h-10 flex-wrap">
          <TabsTrigger value="invoices">
            <DollarSign className="mr-2 h-4 w-4" /> Faturas
          </TabsTrigger>
          <TabsTrigger value="generation">
            <Zap className="mr-2 h-4 w-4" /> Geração
          </TabsTrigger>
          <TabsTrigger value="consumption">
            <Gauge className="mr-2 h-4 w-4" /> Consumo
          </TabsTrigger>
          <TabsTrigger value="cashflow">
            <Wallet className="mr-2 h-4 w-4" /> Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger value="bank">
            <Landmark className="mr-2 h-4 w-4" /> Contas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-4">
          <InvoiceManager />
        </TabsContent>
        <TabsContent value="generation" className="mt-4">
          <PlantGenerationManager />
        </TabsContent>
        <TabsContent value="consumption" className="mt-4">
          <ConsumptionManager />
        </TabsContent>
        <TabsContent value="cashflow" className="mt-4">
          <CashFlowManager />
        </TabsContent>
        <TabsContent value="bank" className="mt-4">
          <BankAccountManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
