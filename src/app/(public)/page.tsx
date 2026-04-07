import Hero from "@/components/sections/Hero"
import IlLuogo from "@/components/sections/IlLuogo"
import RistoranteSection from "@/components/sections/RistoranteSection"
import SpiaggiaSection from "@/components/sections/SpiaggiaSection"
import EventiSection from "@/components/sections/EventiSection"
import PrenotaSection from "@/components/sections/PrenotaSection"

export default function Homepage() {
  return (
    <>
      <Hero />
      <IlLuogo />
      <RistoranteSection />
      <SpiaggiaSection />
      <EventiSection />
      <PrenotaSection />
    </>
  )
}
