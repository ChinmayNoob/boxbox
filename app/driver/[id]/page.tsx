import { notFound } from 'next/navigation'
import f1Data from '@/db/f1.json'
import { type F1Info } from '@/types/f1'
import SectionContainer from '@/components/common/section-container'
import Image from 'next/image'
import { DriverStats } from '@/components/driver/driver-stats'

// Generate static params for all drivers
export function generateStaticParams() {
    const data = f1Data as F1Info
    const drivers = data.teams.flatMap((team) => team.drivers)
    return drivers.map((driver) => ({
        id: driver.name.replaceAll(' ', '-').toLowerCase()
    }))
}

interface DriverPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function DriverPage({ params }: DriverPageProps) {
    const data = f1Data as F1Info
    const { id } = await params

    // Find the driver by converting the URL slug back to the original name
    const drivers = data.teams.flatMap((team) => team.drivers)
    const driver = drivers.find(
        (driver) => driver.name.replaceAll(' ', '-').toLowerCase() === id
    )

    if (!driver) {
        notFound()
    }

    const bgColors = [
        'bg-[#294961]/30',
        'bg-[#1f363b]/30',
        'bg-[#732b40]/30',
        'bg-[#565862]/30',
        'bg-[#246d31]/30',
        'bg-[#704c38]/30',
        'bg-[#2f6f71]/30',
        'bg-[#435364]/30',
        'bg-[#34476c]/30',
        'bg-[#355f74]/30'
    ]

    return (
        <main className='max-w-6xl px-2 lg:px-10 mx-auto mt-14 md:mt-0 w-full overflow-x-hidden font-onest'>
            <SectionContainer className='flex flex-col items-center justify-center pt-[90px] md:pt-[70px] pb-20 lg:pt-[30px] w-full overflow-x-hidden'>
                <div className='grid grid-cols-1 lg:grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,auto)] lg:grid-rows-1 gap-10'>
                    <div className='flex flex-col items-center justify-center gap-y-4 p-4 mt-60'>
                        <div
                            className={`cursor-default flex flex-col items-center justify-center w-[350px] md:w-[420px] h-[100px] hover:scale-110 transition-transform duration-300 ease-in-out group`}
                        >
                            <div className='absolute'>
                                <Image
                                    src={driver.driverImage}
                                    alt={driver.name}
                                    width={420}
                                    height={600}
                                    className={`w-[350px] md:w-[420px] object-contain -translate-y-[13.5rem] md:-translate-y-[16rem]`}
                                />
                            </div>

                            <div
                                className={`flex flex-col items-center justify-center gap-y-2 py-4 w-full ${bgColors[Math.floor((driver.id - 1) / 2)]
                                    } transition-colors duration-300 ease-in-out backdrop-blur-md rounded-xl`}
                            >
                                <h3 className='text-neutral-100 text-3xl md:text-4xl font-semibold font-f1-bold'>
                                    {driver.fullName}
                                </h3>
                                <div className='flex flex-row items-center justify-center gap-x-4'>
                                    <h3 className='text-neutral-100 text-3xl md:text-4xl font-semibold font-f1-regular'>
                                        {driver.raceNumber}
                                    </h3>
                                    <Image
                                        src={driver.countryFlag}
                                        alt={driver.country}
                                        width={32}
                                        height={32}
                                        className='h-8 object-contain'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-y-2 p-4 text-neutral-100'>
                        <div className='relative flex items-center justify-center group'>
                            <div className='relative w-[300px] h-[300px] flex items-center justify-center'>
                                <Image
                                    src={driver.helmetImage}
                                    alt={driver.name}
                                    width={300}
                                    height={300}
                                    className='h-[300px] object-contain'
                                />
                            </div>
                        </div>

                        <DriverStats driver={driver} />
                    </div>
                </div>
            </SectionContainer>
        </main>
    )
}
