import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, BarChart2, Shield, Users, Network, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ERP & CRM Executivo</h2>
          <p className="text-muted-foreground">Visão geral da plataforma ACERSOL.</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" /> Configurações
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total de Clientes', val: '15.420', icon: Users, desc: '+120 esta semana' },
          { title: 'Usinas Operacionais', val: '124', icon: Network, desc: '4 em implantação' },
          { title: 'Receita (MRR)', val: 'R$ 4.2M', icon: TrendingUp, desc: '+12% vs mês ant.' },
          { title: 'Eficiência', val: '98.5%', icon: BarChart2, desc: 'Motor Inteligente Ativo' },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.val}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="crm" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="crm">CRM Pipeline</TabsTrigger>
          <TabsTrigger value="engine">Motor de Alocação</TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>Acompanhe a conversão do site e equipe comercial.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 h-[400px]">
                {[
                  { stage: 'Leads Captados', count: 450, color: 'border-blue-200' },
                  { stage: 'Proposta Enviada', count: 120, color: 'border-amber-200' },
                  { stage: 'Em Negociação', count: 45, color: 'border-purple-200' },
                  { stage: 'Contratos Fechados', count: 18, color: 'border-green-200' },
                ].map((col, i) => (
                  <div
                    key={i}
                    className={`flex-1 bg-muted/50 rounded-xl border-t-4 ${col.color} p-4 overflow-y-auto`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-sm">{col.stage}</h4>
                      <span className="bg-background text-xs px-2 py-1 rounded-full border">
                        {col.count}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="bg-background p-3 rounded-lg border shadow-sm cursor-pointer hover:border-brand-blue transition-colors"
                        >
                          <p className="font-medium text-sm">Empresa/Cliente #{item + i * 10}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Valor Est.: R$ 2.{item}00
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engine">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-brand-blue" />
                Motor Inteligente de Alocação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-card p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4 col-span-2">
                    <h4 className="font-semibold">Lógica de Distribuição Atual</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>1. Priorizar clientes com faturas a vencer</span>
                        <span className="text-brand-green font-medium">Ativo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>2. Minimizar Custo de Disponibilidade</span>
                        <span className="text-brand-green font-medium">Ativo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>3. Compensação Sazonal Automática</span>
                        <span className="text-brand-green font-medium">Ativo</span>
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <Button className="bg-brand-blue hover:bg-blue-800 text-white">
                        Forçar Recálculo Global
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg flex flex-col justify-center items-center text-center">
                    <Shield className="h-12 w-12 text-brand-green mb-4" />
                    <h5 className="font-semibold">Status do Algoritmo</h5>
                    <p className="text-sm text-muted-foreground mt-2">
                      Nenhuma sobra não alocada identificada na rede CEMIG e CPFL.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
