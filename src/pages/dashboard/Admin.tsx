import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Settings,
  BarChart2,
  Shield,
  Users,
  Network,
  TrendingUp,
  FolderOpen,
  Plus,
  UserPlus,
  FileText,
  Zap,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { AdminCRM } from '@/components/dashboard/AdminCRM'

export default function AdminDashboard() {
  const [hasData, setHasData] = useState(false)

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-dashed">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ERP & CRM Executivo</h2>
          <p className="text-muted-foreground">Visão geral da plataforma ACERSOL.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-3 bg-background px-5 py-2.5 rounded-full shadow-sm border transition-colors hover:border-brand-blue/30">
            <Switch id="demo-mode" checked={hasData} onCheckedChange={setHasData} />
            <Label htmlFor="demo-mode" className="font-medium cursor-pointer text-sm">
              {hasData ? 'Dados de Teste Ativos' : 'Modo Real (Vazio)'}
            </Label>
          </div>
          <Button variant="outline" className="hidden sm:flex rounded-full">
            <Settings className="mr-2 h-4 w-4" /> Configurações
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total de Clientes',
            val: hasData ? '15.420' : '0',
            icon: Users,
            desc: hasData ? '+120 esta semana' : 'Nenhum cliente cadastrado',
          },
          {
            title: 'Usinas Operacionais',
            val: hasData ? '124' : '0',
            icon: Network,
            desc: hasData ? '4 em implantação' : 'Nenhuma usina conectada',
          },
          {
            title: 'Receita (MRR)',
            val: hasData ? 'R$ 4.2M' : 'R$ 0,00',
            icon: TrendingUp,
            desc: hasData ? '+12% vs mês ant.' : 'Sem faturamento',
          },
          {
            title: 'Eficiência',
            val: hasData ? '98.5%' : '-',
            icon: BarChart2,
            desc: hasData ? 'Motor Inteligente Ativo' : 'Aguardando dados',
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="transition-all duration-300 hover:shadow-md hover:border-brand-blue/30 border-muted"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-brand-blue/50" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{kpi.val}</div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="crm" className="w-full">
        <TabsList className="mb-4 h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="crm" className="rounded-lg">
            CRM Pipeline
          </TabsTrigger>
          <TabsTrigger value="engine" className="rounded-lg">
            Motor de Alocação
          </TabsTrigger>
          <TabsTrigger value="finance" className="rounded-lg">
            Financeiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-4">
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>Acompanhe a conversão do site e equipe comercial.</CardDescription>
            </CardHeader>
            <CardContent>
              {hasData ? (
                <AdminCRM />
              ) : (
                <EmptyState
                  icon={<FolderOpen className="h-10 w-10 text-brand-blue" />}
                  title="Nenhum Lead no Funil"
                  description="Você ainda não possui leads captados ou oportunidades em andamento no CRM da ACERSOL."
                  action={
                    <Button className="mt-4 bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md shadow-brand-blue/20 px-8">
                      <Plus className="mr-2 h-4 w-4" /> Importar Leads
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engine">
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Network className="h-6 w-6 text-brand-blue" />
                Motor Inteligente de Alocação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasData ? (
                <div className="rounded-2xl border bg-card p-8 shadow-sm">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-6 col-span-2">
                      <h4 className="font-semibold text-lg border-b pb-4">
                        Lógica de Distribuição Atual
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">
                            1. Priorizar clientes com faturas a vencer
                          </span>
                          <span className="text-brand-green font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            ATIVO
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">2. Minimizar Custo de Disponibilidade</span>
                          <span className="text-brand-green font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            ATIVO
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">3. Compensação Sazonal Automática</span>
                          <span className="text-brand-green font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            ATIVO
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 flex gap-4">
                        <Button className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md">
                          Forçar Recálculo Global
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-brand-blue/5 to-brand-green/5 p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-brand-blue/10">
                      <Shield className="h-16 w-16 text-brand-green mb-6 drop-shadow-md" />
                      <h5 className="font-bold text-lg">Status do Algoritmo</h5>
                      <p className="text-sm text-muted-foreground mt-3 font-medium">
                        Nenhuma sobra não alocada identificada na rede elétrica.
                      </p>
                    </div>
                  </div>

                  {/* Vínculo de Dados */}
                  <div className="mt-8 border-t pt-8">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Network className="h-5 w-5 text-brand-blue" />
                      Vínculos Ativos (Usinas x Clientes)
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-muted bg-background/50">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 font-medium">Usina Geradora</th>
                            <th className="px-4 py-3 font-medium">Cliente Beneficiário</th>
                            <th className="px-4 py-3 font-medium">Percentual de Rateio</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-muted">
                          <tr className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                              <Zap className="h-3 w-3 text-yellow-500" /> Usina Solar Alvorada (500
                              kWp)
                            </td>
                            <td className="px-4 py-3">Supermercado Silva Ltda</td>
                            <td className="px-4 py-3">35%</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full font-medium">
                                Homologado
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                              <Zap className="h-3 w-3 text-yellow-500" /> Usina Solar Alvorada (500
                              kWp)
                            </td>
                            <td className="px-4 py-3">Padaria Doce Pão</td>
                            <td className="px-4 py-3">15%</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full font-medium">
                                Homologado
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                              <Zap className="h-3 w-3 text-yellow-500" /> Central Fotovoltaica Minas
                              (1.2 MWp)
                            </td>
                            <td className="px-4 py-3">Indústria Metalúrgica XYZ</td>
                            <td className="px-4 py-3">80%</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full font-medium">
                                Em Validação
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<Shield className="h-10 w-10 text-brand-blue" />}
                  title="Motor em Repouso"
                  description="O motor inteligente de alocação entrará em operação automaticamente assim que as usinas e clientes forem conectados e homologados na plataforma."
                  action={
                    <div className="flex gap-4 mt-6">
                      <Button variant="outline" className="rounded-full px-6">
                        <UserPlus className="mr-2 h-4 w-4" /> Adicionar Cliente
                      </Button>
                      <Button className="bg-brand-blue text-white rounded-full shadow-md shadow-brand-blue/20 px-6">
                        <Network className="mr-2 h-4 w-4" /> Cadastrar Usina
                      </Button>
                    </div>
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Visão Financeira</CardTitle>
              <CardDescription>
                Fluxo de caixa, faturamento unificado e repasses programados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasData ? (
                <div className="h-80 flex flex-col items-center justify-center border border-dashed rounded-2xl bg-muted/10">
                  <BarChart2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium">
                    Gráficos financeiros carregados em modo de demonstração.
                  </p>
                </div>
              ) : (
                <EmptyState
                  icon={<FileText className="h-10 w-10 text-brand-blue" />}
                  title="Sem Movimentações Financeiras"
                  description="Nenhum faturamento ou repasse foi gerado até o momento. O fluxo financeiro iniciará junto com o primeiro ciclo de compensação de créditos."
                  action={
                    <Button variant="outline" className="mt-4 rounded-full px-8">
                      Configurar Dados Bancários
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
