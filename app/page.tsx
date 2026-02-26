import Hero from "@/components/section/hero";
import SectionContainer from "@/components/common/section-container";
import f1Data from "@/db/f1.json";
import { type F1Info } from "@/types/f1";
import Schedule from "@/components/section/schedule";
import Result from "@/components/section/result";
import Team from "@/components/section/team";
import Driver from "@/components/section/driver";
export default function Home() {
  return (
    <main
      className='max-w-6xl px-2 lg:px-10 mx-auto mt-14 md:mt-0 w-full overflow-x-hidden '
    >
      <SectionContainer
        className='flex w-full items-center justify-center py-20 h-screen animate-fade-in-up'
      >
        <Hero />
      </SectionContainer>
      <SectionContainer
        id='schedule'
        className='flex items-center justify-center pb-20'
      >
        <Schedule circuits={(f1Data as F1Info).circuits} />
      </SectionContainer>
      <SectionContainer
        id='results'
        className='flex items-center justify-center pb-20'
      >
        <Result teams={(f1Data as F1Info).teams} />
      </SectionContainer>
      <SectionContainer
        id='teams'
        className='flex items-center justify-center pb-20'
      >
        <Team teams={(f1Data as F1Info).teams} />
      </SectionContainer>
      <SectionContainer
        id='drivers'
        className='flex items-center justify-center pb-20'
      >
        <Driver teams={(f1Data as F1Info).teams} />
      </SectionContainer>
    </main>
  );
}
