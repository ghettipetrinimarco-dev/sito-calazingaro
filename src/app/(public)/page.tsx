import Hero from "@/components/sections/Hero"
import IlLuogo from "@/components/sections/IlLuogo"
import StoriaSection from "@/components/sections/StoriaSection"
import RistoranteSection from "@/components/sections/RistoranteSection"
import FullwidthPhoto from "@/components/sections/FullwidthPhoto"
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
      <RistoranteSection />
      <FullwidthPhoto
        src="/Cucina/Cala-Zingaro-Cucina-2.webp"
        alt="Cena Cala Zingaro"
        height="60vh"
        position="center 30%"
      />
      <SpiaggiaSection />
      <StoriaSection />
      <EventiSection />
      <PrenotazioneSection />
      <EventiPrivatiSection />
      <FullwidthPhoto
        src="/Ambiente/Cala-Zingaro-Ambiente-1.webp"
        alt="Spiaggia Cala Zingaro"
        height="50vh"
        position="center 40%"
      />
      <InstagramSection />
    </>
  )
}
