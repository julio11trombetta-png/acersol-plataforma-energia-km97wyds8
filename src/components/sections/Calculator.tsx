import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calculator as CalcIcon,
  DollarSign,
  Zap,
  TrendingDown,
  ArrowRight,
  Leaf,
} from 'lucide-react'

export function Calculator() {
  const [billValue, setBillValue] = useState<string>('500')

  const value = parseFloat(billValue) || 0
  const savings = value * 0.18
  const totalWithDiscount = value - savings
  const estimatedCredits = Math.round(value / 0.95)

  return (
    <section id="calculadora" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            <CalcIcon className="mr-2 h-4 w-4 text-brand-blue" />
            Simulador Inteligente
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Descubra o quanto você pode economizar
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start max-w-6xl mx-auto">
          <Card className="lg:col-span-3 border-2">
            <CardHeader>
              <CardTitle>Dados da Conta</CardTitle>
              <CardDescription>Insira as informações da sua fatura atual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concessionaria">Concessionária</Label>
                  <Select defaultValue="cemig">
                    <SelectTrigger id="concessionaria">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cemig">CEMIG</SelectItem>
                      <SelectItem value="cpfl">CPFL</SelectItem>
                      <SelectItem value="enel">ENEL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select defaultValue="MG">
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" placeholder="Ex: Belo Horizonte" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Médio da Conta (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    value={billValue}
                    onChange={(e) => setBillValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumo">Consumo Médio (kWh)</Label>
                  <Input
                    id="consumo"
                    type="number"
                    value={estimatedCredits}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="classe">Classe</Label>
                  <Select defaultValue="residencial">
                    <SelectTrigger id="classe">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Ligação</Label>
                  <Select defaultValue="trifasico">
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monofasico">Monofásico</SelectItem>
                      <SelectItem value="trifasico">Trifásico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-brand-blue to-brand-blue/80 text-white border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Sua Economia Estimada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between border-b border-blue-400/30 pb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-brand-yellow" />
                    <span>Economia Mensal</span>
                  </div>
                  <span className="text-2xl font-bold text-brand-yellow">
                    R$ {savings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-400/30 pb-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-200" />
                    <span>Créditos</span>
                  </div>
                  <span className="text-xl font-semibold">{estimatedCredits} kWh</span>
                </div>
                <div className="flex justify-between pb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-blue-200" />
                    <span>Nova Conta</span>
                  </div>
                  <span className="text-xl font-bold">R$ {totalWithDiscount.toFixed(2)}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-white text-brand-blue hover:bg-blue-50 font-semibold group"
                >
                  Receber Proposta{' '}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-4 flex items-start gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-brand-green shrink-0">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Impacto Ambiental</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Você evitará a emissão de{' '}
                  <strong className="text-foreground">
                    {(estimatedCredits * 0.08).toFixed(1)} kg de CO₂
                  </strong>{' '}
                  por mês.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
