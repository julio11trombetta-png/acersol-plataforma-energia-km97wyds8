import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Sun, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/20 via-background to-background dark:from-brand-blue/10"></div>
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand-green/20 blur-[100px] dark:bg-brand-green/10"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue dark:text-blue-400 mb-8 animate-fade-in-up">
              <Zap className="h-4 w-4" />
              <span>Energia do Futuro, Hoje</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              Economize até 20% na sua conta de energia{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">
                sem instalar placas solares
              </span>
              .
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              A plataforma ACERSOL conecta você às melhores usinas de energia renovável. Sem obras,
              sem investimento inicial, apenas economia pura todo mês.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90 text-white shadow-lg shadow-brand-blue/25"
                asChild
              >
                <a href="#calculadora">
                  Quero Economizar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full border-2"
                asChild
              >
                <Link to="/login">Cadastrar Minha Usina</Link>
              </Button>
            </div>
          </div>

          <div
            className="flex-1 relative w-full max-w-lg lg:max-w-none min-h-[400px] animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-brand-green/10 rounded-3xl border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden glass">
              <div className="absolute top-4 left-4 right-4 flex gap-4">
                <div
                  className="flex-1 bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/5 animate-float"
                  style={{ animationDelay: '0s' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <LineChart className="h-5 w-5 text-brand-blue dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      +18%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Economia Total</p>
                  <p className="text-xl font-bold">R$ 1.240</p>
                </div>
                <div
                  className="flex-1 bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/5 animate-float"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Sun className="h-5 w-5 text-brand-green" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      Ativo
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Créditos</p>
                  <p className="text-xl font-bold">450 kWh</p>
                </div>
              </div>

              <div
                className="absolute bottom-4 left-4 right-4 bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/5 animate-float"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">Usina Solar ACERSOL I</p>
                    <p className="text-xs text-muted-foreground">Rio Grande do Sul, Brasil</p>
                    <span className="text-[10px] font-medium text-brand-blue bg-brand-blue/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                      RGE
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-brand-green bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-brand-green animate-pulse"></div>
                    Gerando
                  </div>
                </div>
                <div className="h-24 w-full flex items-end gap-2">
                  {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-brand-blue/20 dark:bg-brand-blue/40 rounded-t-sm relative group transition-all duration-300 hover:bg-brand-blue"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}0W
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
