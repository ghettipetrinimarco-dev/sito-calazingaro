import Hero from "@/components/sections/Hero"
import IlLuogo from "@/components/sections/IlLuogo"
import StoriaSection from "@/components/sections/StoriaSection"
import RistoranteSection from "@/components/sections/RistoranteSection"
import SpiaggiaSection from "@/components/sections/SpiaggiaSection"
import EventiSection from "@/components/sections/EventiSection"
import PrenotazioneSection from "@/components/sections/PrenotazioneSection"
import EventiPrivatiSection from "@/components/sections/EventiPrivatiSection"
import InstagramSection from "@/components/sections/InstagramSection"

export default function Homepage() {
  return (
    <>
      <Hero />
      <IlLuogo />
      <StoriaSection />
      <RistoranteSection />
      <SpiaggiaSection />
      <EventiSection />
      <PrenotazioneSection />
      <EventiPrivatiSection />
      <InstagramSection />
    </>
  )
}
