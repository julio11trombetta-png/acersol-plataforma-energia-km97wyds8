import { Zap, Sun, ShieldCheck, BarChart3, Clock, Smartphone } from 'lucide-react'

const features = [
  {
    name: 'Adesão 100% Digital',
    description: 'Sem burocracia. Processo feito pelo celular em minutos.',
    icon: Smartphone,
  },
  {
    name: 'Sem Investimento Inicial',
    description: 'Nós conectamos você a usinas já prontas e operando.',
    icon: Sun,
  },
  {
    name: 'Economia Garantida',
    description: 'O desconto é aplicado diretamente na sua fatura através de compensação.',
    icon: Zap,
  },
  {
    name: 'Segurança Jurídica',
    description: 'Em total conformidade com a Lei 14.300/22 e normas da ANEEL.',
    icon: ShieldCheck,
  },
  {
    name: 'Transparência Total',
    description: 'Acompanhe seus créditos e faturas pelo nosso aplicativo exclusivo.',
    icon: BarChart3,
  },
  {
    name: 'Ativação Rápida',
    description: 'A conexão com a usina e os descontos iniciam em até 60 dias.',
    icon: Clock,
  },
]

export function Features() {
  return (
    <section id="como-funciona" className="py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">Como a ACERSOL funciona?</h2>
          <p className="max-w-[85%] text-muted-foreground sm:text-lg">
            A forma mais inteligente, tecnológica e sustentável de consumir energia elétrica no
            Brasil.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-16">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="overflow-hidden rounded-2xl border bg-background p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:text-blue-400 group-hover:bg-brand-blue group-hover:text-white transition-colors mb-6">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">{feature.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
