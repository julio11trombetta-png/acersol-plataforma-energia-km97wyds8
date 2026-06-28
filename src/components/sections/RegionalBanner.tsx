import { MapPin, Zap, Building2 } from 'lucide-react'

export function RegionalBanner() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green mb-4 animate-fade-in-up">
            <MapPin className="h-4 w-4" />
            <span>Matriz em Rio Grande do Sul</span>
          </div>
          <h2 className="text-3xl font-bold md:text-4xl animate-fade-in-up">
            Foco regional, impacto nacional
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
            A ACERSOL tem sua sede no Rio Grande do Sul, atuando como referência na gestão de
            energia solar compartilhada na área de concessão da RGE.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-background hover:shadow-lg transition-shadow">
              <div className="p-3 bg-brand-green/10 rounded-full">
                <MapPin className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="font-semibold">Sede em RS</h3>
              <p className="text-sm text-muted-foreground">
                Matriz localizada no Rio Grande do Sul
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-background hover:shadow-lg transition-shadow">
              <div className="p-3 bg-brand-blue/10 rounded-full">
                <Zap className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="font-semibold">Parceria RGE</h3>
              <p className="text-sm text-muted-foreground">
                Especialistas na área de concessão da RGE
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-background hover:shadow-lg transition-shadow">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Building2 className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold">Atuação Regional</h3>
              <p className="text-sm text-muted-foreground">
                Energia solar compartilhada no Sul do Brasil
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
