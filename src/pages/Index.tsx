import { Hero } from '@/components/sections/Hero'
import { Calculator } from '@/components/sections/Calculator'
import { Features } from '@/components/sections/Features'
import { Stats } from '@/components/sections/Stats'

export default function Index() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Features />
      <Calculator />
      <Stats />
    </div>
  )
}
