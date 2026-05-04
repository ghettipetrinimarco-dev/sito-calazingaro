import Hero from "@/components/sections/Hero"
import IlLuogo from "@/components/sections/IlLuogo"
import SpiaggiaSection from "@/components/sections/SpiaggiaSection"
import RistoranteSection from "@/components/sections/RistoranteSection"
import StoriaSection from "@/components/sections/StoriaSection"
import EventiSection from "@/components/sections/EventiSection"
import InstagramSection from "@/components/sections/InstagramSection"
import DemoLock from "@/components/ui/DemoLock"

export default function Homepage() {
  return (
    <>
      <Hero />
      <IlLuogo />
      <SpiaggiaSection />
      <RistoranteSection />
      <DemoLock>
        <StoriaSection />
        <EventiSection />
      </DemoLock>
      <InstagramSection />
    </>
  )
}
