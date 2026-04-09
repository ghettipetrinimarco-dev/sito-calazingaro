import Hero from "@/components/sections/Hero"
import IlLuogo from "@/components/sections/IlLuogo"
import SpiaggiaSection from "@/components/sections/SpiaggiaSection"
import RistoranteSection from "@/components/sections/RistoranteSection"
import StoriaSection from "@/components/sections/StoriaSection"
import EventiSection from "@/components/sections/EventiSection"
import InstagramSection from "@/components/sections/InstagramSection"
import PrenotazioneSection from "@/components/sections/PrenotazioneSection"

export default function Homepage() {
  return (
    <>
      <Hero />
      <IlLuogo />
      <SpiaggiaSection />
      <RistoranteSection />
      <StoriaSection />
      <EventiSection />
      <InstagramSection />
      <PrenotazioneSection />
    </>
  )
}
