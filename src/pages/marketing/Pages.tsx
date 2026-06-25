import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const PageHeader = ({ title, description }: { title: string; description: string }) => (
  <section className="bg-brand-dark text-white py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/30 to-transparent"></div>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-50"></div>
    <div className="container relative z-10 text-center space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in-up">{title}</h1>
      <p
        className="text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
      >
        {description}
      </p>
    </div>
  </section>
)

export function AboutPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Sobre Nós"
        description="Nascemos com o propósito de democratizar o acesso à energia limpa e renovável no Brasil."
      />
      <div className="container py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-right">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">
              A ACERSOL
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Somos uma plataforma digital que conecta geradores de energia renovável a consumidores
              finais. Nossa tecnologia permite que qualquer pessoa ou empresa usufrua de energia
              solar sem a necessidade de investimentos em infraestrutura ou instalação de painéis.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Com um design system premium e algoritmos inteligentes de alocação, entregamos
              economia e sustentabilidade de forma simples e transparente.
            </p>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-brand-blue/20 animate-slide-left border border-muted">
            <img
              src="https://img.usecurling.com/p/800/600?q=solar%20panel&color=blue"
              alt="Solar Panels"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientsPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Para Clientes"
        description="Economize até 20% na sua conta de energia todos os meses, sem obras e sem burocracia."
      />
      <div className="container py-24 text-center space-y-12">
        <h2 className="text-3xl font-bold tracking-tight">Por que escolher a ACERSOL?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Zero Investimento',
              desc: 'Não é necessário comprar ou instalar placas solares na sua propriedade.',
            },
            {
              title: 'Economia Imediata',
              desc: 'Desconto garantido e aplicado diretamente na fatura mensal de energia.',
            },
            {
              title: 'Sustentabilidade',
              desc: 'Consumo 100% compensado por fontes renováveis e totalmente limpas.',
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="border-2 hover:border-brand-blue/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          size="lg"
          asChild
          className="bg-brand-blue text-white rounded-full shadow-lg shadow-brand-blue/20"
        >
          <Link to="/">Simule sua Economia</Link>
        </Button>
      </div>
    </div>
  )
}

export function OwnersPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Para Usinas"
        description="Maximize o retorno da sua usina conectando-se automaticamente a milhares de clientes."
      />
      <div className="container py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-brand-green/20 order-2 md:order-1 border border-muted">
            <img
              src="https://img.usecurling.com/p/800/600?q=solar%20farm&color=green"
              alt="Solar Farm"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-bold text-brand-green">Gestão Inteligente</h2>
            <ul className="space-y-4 text-lg text-muted-foreground">
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-brand-green mr-3"></span> Alocação
                automática de créditos de energia.
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-brand-green mr-3"></span> Gestão de
                inadimplência e faturamento (Billing).
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-brand-green mr-3"></span> Painel exclusivo
                de acompanhamento em tempo real.
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-brand-green mr-3"></span> Motor de
                otimização contínua de sobras.
              </li>
            </ul>
            <Button
              size="lg"
              className="bg-brand-green text-white hover:bg-green-700 rounded-full shadow-lg shadow-brand-green/20"
            >
              Cadastre sua Usina
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Dúvidas Frequentes"
        description="Encontre respostas para as perguntas mais comuns sobre o ecossistema de energia compartilhada."
      />
      <div className="container max-w-3xl py-24">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">
              Como a energia chega na minha casa?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
              A energia continua sendo entregue pela sua concessionária local (como CEMIG, CPFL,
              ENEL, etc). O que muda é que a nossa rede de usinas injeta energia limpa no sistema,
              gerando créditos que são abatidos na sua conta.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg">
              Preciso cancelar meu contrato atual com a concessionária?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
              Não! A sua ligação com a distribuidora local continua 100% ativa e não requer nenhuma
              alteração física. Você apenas passará a receber uma fatura inteligente detalhando os
              créditos abatidos e o valor final reduzido.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg">
              Existe fidelidade ou taxa de adesão?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
              Zero taxa de adesão e zero custo surpresa. Nossos contratos são totalmente flexíveis e
              desenhados para que você tenha apenas benefícios, focando inteiramente na sua economia
              mês a mês.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export function BlogPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Blog & Novidades"
        description="Insights, tendências e atualizações do mercado livre e geração distribuída de energia."
      />
      <div className="container py-24 grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((post) => (
          <Card
            key={post}
            className="overflow-hidden border-2 hover:border-brand-blue/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="overflow-hidden h-48">
              <img
                src={`https://img.usecurling.com/p/400/250?q=green%20energy&seed=${post}`}
                alt="Post"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl hover:text-brand-blue cursor-pointer transition-colors line-clamp-2">
                O futuro da energia solar no Brasil e a Geração Distribuída em 2026
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm line-clamp-3">
                Descubra como as novas regulamentações estão impulsionando o mercado de Geração
                Distribuída e como você, como cliente ou usina, pode se beneficiar do cenário atual.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ContactPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Fale Conosco"
        description="Nossa equipe de especialistas está pronta para ajudar você a transformar sua forma de consumir energia."
      />
      <div className="container max-w-2xl py-24">
        <Card className="p-8 shadow-2xl border-none ring-1 ring-border/50">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail Profissional</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
                  placeholder="joao@empresa.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sua Mensagem</label>
              <textarea
                className="w-full px-4 py-3 bg-muted/50 border rounded-xl h-32 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all resize-none"
                placeholder="Como podemos ajudar o seu negócio?"
              ></textarea>
            </div>
            <Button className="w-full bg-brand-blue text-white rounded-full shadow-lg shadow-brand-blue/25 hover:bg-blue-800 transition-colors h-12 text-md">
              Enviar Mensagem Segura
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
