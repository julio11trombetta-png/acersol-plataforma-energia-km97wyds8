import { Hero } from '@/components/sections/Hero'
import { Calculator } from '@/components/sections/Calculator'
import { Features } from '@/components/sections/Features'
import { Stats } from '@/components/sections/Stats'
import { RegionalBanner } from '@/components/sections/RegionalBanner'

export default function Index() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Features />
      <RegionalBanner />
      <Calculator />
      <Stats />
    </div>
  )
}
