import { notFound } from 'next/navigation'
import f1Data from '@/db/f1.json'
import { type F1Info } from '@/types/f1'
import SectionContainer from '@/components/common/section-container'
import Podium from '@/components/podium'
import Image from 'next/image'

// Generate static params for all circuits
export function generateStaticParams() {
    const data = f1Data as F1Info
    return data.circuits.map((circuit) => ({
        id: circuit.name.replaceAll(' ', '-').toLowerCase()
    }))
}

interface CircuitPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function CircuitPage({ params }: CircuitPageProps) {
    const data = f1Data as F1Info
    const { id } = await params

    // Find the circuit by converting the URL slug back to the original name
    const circuit = data.circuits.find(
        (circuit) => circuit.name.replaceAll(' ', '-').toLowerCase() === id
    )

    if (!circuit) {
        notFound()
    }

    return (
        <main className='max-w-6xl px-2 lg:px-10 mx-auto mt-14 md:mt-0 w-full overflow-x-hidden font-onest'>
            <SectionContainer className='flex flex-col items-center justify-center py-20 h-screen animate-fade-in-up'>
                <div className='flex flex-col items-center justify-center gap-y-12 text-center cursor-default'>
                    {/* Circuit Title */}
                    <div className='space-y-4'>
                        <h1 className='font-bold text-5xl md:text-6xl lg:text-7xl text-white tracking-tight transition-colors duration-300 hover:text-[#f41d00]'>
                            {circuit.fullName}
                        </h1>
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent"></div>
                    </div>

                    {/* Country and Circuit Name */}
                    <div className='flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8'>
                        <div className='relative group'>
                            <Image
                                src={circuit.countryFlag}
                                alt={circuit.name}
                                width={72}
                                height={72}
                                className='h-16 md:h-18 object-contain transition-transform duration-300 group-hover:scale-110'
                            />
                        </div>
                        <div className='flex flex-col items-center md:items-start gap-2'>
                            <h2 className='font-semibold text-2xl md:text-3xl lg:text-4xl text-neutral-100'>
                                {circuit.name}
                            </h2>
                            <h3 className='text-neutral-300 font-medium text-lg md:text-xl'>
                                {circuit.generalDate}
                            </h3>
                        </div>
                    </div>

                    {/* Optional decorative element */}
                    <div className='flex items-center gap-4 opacity-60'>
                        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent"></div>
                        <div className='w-2 h-2 bg-[#f41d00] rounded-full animate-pulse'></div>
                        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent"></div>
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer className='flex items-center justify-center pb-20'>
                <Podium podium={circuit.podium} />
            </SectionContainer>

            <SectionContainer
                className='flex flex-col items-center justify-center pb-20 gap-y-20'
            >
                <div className='flex flex-row items-center justify-center w-full text-center'>
                    <div
                        className='h-[4px] w-1/5 bg-gradient-to-r from-transparent via-neutral-100/60 to-transparent'
                    >
                    </div>
                    <h2 className='text-neutral-200 font-semibold text-4xl w-3/5'>
                        {circuit.circuit}
                    </h2>
                    <div
                        className='h-[4px] w-1/5 bg-gradient-to-r from-transparent via-neutral-100/60 to-transparent'
                    >
                    </div>
                </div>
                <div
                    className='flex flex-col md:flex-row items-center justify-center gap-x-12 gap-y-14'
                >
                    <div className='relative flex items-center justify-center group'>
                        <img
                            src={circuit.circuitImage}
                            alt={circuit.name}
                            className='h-64 md:h-74 object-contain blur-sm opacity-50
             transition duration-500 ease-in-out group-hover:scale-130
              delay-200 group-hover:opacity-0'
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <img
                                src={circuit.circuitImage}
                                alt={circuit.name}
                                className='h-60 md:h-70 object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out'
                            />
                        </div>
                    </div>
                    <div
                        className='grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(3,auto)] gap-x-6 gap-y-8 text-neutral-100 cursor-default'
                    >
                        <div
                            className='flex flex-col items-start justify-center gap-y-2 rounded-xl py-2 px-4 backdrop-blur-md bg-gradient-to-b from-[#15122c] via-[#15122c]/50 to-transparent border-0 transition-transform duration-500 ease-in-out hover:-translate-y-2'
                        >
                            <h2 className='font-normal text-xl text-neutral-200'>
                                First Grand Prix
                            </h2>
                            <h3 className='font-semibold text-3xl'>{circuit.firstGrandPrix}</h3>
                        </div>

                        <div
                            className='flex flex-col items-start justify-center gap-y-2 rounded-xl py-2 px-4 backdrop-blur-md bg-gradient-to-b from-[#15122c] via-[#15122c]/50 to-transparent border-0 transition-transform duration-500 ease-in-out hover:-translate-y-2'
                        >
                            <h2 className='font-normal text-xl text-neutral-200'>
                                Number of Laps
                            </h2>
                            <h3 className='font-semibold text-3xl'>{circuit.numberOfLaps}</h3>
                        </div>

                        <div
                            className='flex flex-col items-start justify-center gap-y-2 rounded-xl py-2 px-4 backdrop-blur-md bg-gradient-to-b from-[#15122c] via-[#15122c]/50 to-transparent border-0 transition-transform duration-500 ease-in-out hover:-translate-y-2'
                        >
                            <h2 className='font-normal text-xl text-neutral-200'>
                                Circuit Length
                            </h2>
                            <h3 className='font-semibold text-3xl'>{circuit.circuitLength}</h3>
                        </div>

                        <div
                            className='flex flex-col items-start justify-center gap-y-2 rounded-xl py-2 px-4 backdrop-blur-md bg-gradient-to-b from-[#15122c] via-[#15122c]/50 to-transparent border-0 transition-transform duration-500 ease-in-out hover:-translate-y-2'
                        >
                            <h2 className='font-normal text-xl text-neutral-200'>
                                Race Distance
                            </h2>
                            <h3 className='font-semibold text-3xl'>{circuit.raceDistance}</h3>
                        </div>

                        <div
                            className='flex flex-col items-start justify-center gap-y-2 col-span-2 rounded-xl py-2 px-4 backdrop-blur-md bg-gradient-to-b from-[#15122c] via-[#15122c]/50 to-transparent border-0 transition-transform duration-500 ease-in-out hover:-translate-y-2'
                        >
                            <h2 className='font-normal text-xl'>Fastest Lap</h2>
                            <h3 className='font-semibold text-3xl gap-2'>
                                {circuit.lapRecord}
                                <span className='font-semibold text-2xl'
                                >{circuit.driverLapRecord}</span
                                >
                            </h3>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </main>
    )
} 