import { Users, SunDim, BatteryCharging, TrendingUp } from 'lucide-react'

const stats = [
  { id: 1, name: 'Clientes Ativos', value: '15.000+', icon: Users },
  { id: 2, name: 'Usinas Conectadas', value: '120+', icon: SunDim },
  { id: 3, name: 'Energia Compartilhada', value: '45 GWh', icon: BatteryCharging },
  { id: 4, name: 'Economia Gerada', value: 'R$ 12M+', icon: TrendingUp },
]

export function Stats() {
  return (
    <section className="bg-brand-dark py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Impacto Real em Números
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Junte-se à revolução energética e faça parte dessa estatística.
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
              >
                <div className="p-3 bg-brand-blue/20 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-brand-blue dark:text-blue-400" />
                </div>
                <dd className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {stat.value}
                </dd>
                <dt className="text-base font-medium text-gray-400">{stat.name}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
