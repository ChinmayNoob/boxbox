import { notFound } from 'next/navigation'
import f1Data from '@/db/f1.json'
import { type F1Info } from '@/types/f1'
import SectionContainer from '@/components/common/section-container'
import TeamDriver from '@/components/team/team-driver'
import TeamRowInfo from '@/components/team/team-row-info'

// Generate static params for all teams
export function generateStaticParams() {
    const data = f1Data as F1Info
    return data.teams.map((team) => ({
        id: team.name.replaceAll(' ', '-').toLowerCase()
    }))
}

interface TeamPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function TeamPage({ params }: TeamPageProps) {
    const data = f1Data as F1Info
    const { id } = await params

    // Find the team by converting the URL slug back to the original name
    const team = data.teams.find(
        (team) => team.name.replaceAll(' ', '-').toLowerCase() === id
    )

    if (!team) {
        notFound()
    }

    const textColors = [
        'group-hover:text-[#01a0e8]',
        'group-hover:text-[#239970]',
        'group-hover:text-[#e90021]',
        'group-hover:text-[#b7bbbd]',
        'group-hover:text-[#53e253]',
        'group-hover:text-[#fe8001]',
        'group-hover:text-[#27eecd]',
        'group-hover:text-[#1535cb]',
        'group-hover:text-[#3671c6]',
        'group-hover:text-[#1664d4]'
    ]

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

    const gradientColors = [
        'from-[#fe88bc]/60 via-[#fe88bc]/50',
        'from-[#1f363b] via-[#1f363b]',
        'from-[#732b40] via-[#732b40]',
        'from-[#fefffe]/90 via-[#fefffe]/80',
        'from-[#246d31] via-[#246d31]',
        'from-[#704c38] via-[#704c38]',
        'from-[#2f6f71] via-[#2f6f71]',
        'from-[#435364] via-[#435364]',
        'from-[#34476c] via-[#34476c]',
        'from-[#355f74] via-[#355f74]'
    ]

    return (
        <main className='max-w-6xl px-2 lg:px-10 mx-auto mt-14 md:mt-0 w-full overflow-x-hidden font-onest'>
            <SectionContainer className='flex flex-col items-center justify-center py-20 h-screen'>
                <div className='flex flex-col items-center justify-center gap-y-[4.5rem] text-center cursor-default text-neutral-100 hover:-translate-y-2 transition duration-500 ease-in-out group'>
                    <div className='relative mt-16'>
                        <h1 className='font-bold text-4xl md:text-6xl blur-sm opacity-20 translate-y-4 translate-x-4 transition duration-500 ease-in-out group-hover:scale-[1.3] delay-200 group-hover:opacity-0'>
                            {team.fullName}
                        </h1>
                        <div className={`absolute inset-0 flex items-center justify-center ${textColors[team.id - 1]} transition-colors duration-500 ease-in-out`}>
                            <h1 className='font-bold font-f1-wide text-4xl md:text-6xl'>
                                {team.fullName}
                            </h1>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <div className={`flex items-center justify-center px-4 py-2 h-[17.5rem] md:h-[21rem] w-[400px] md:w-[700px] bg-gradient-to-b ${gradientColors[team.id - 1]} to-transparent transition-colors duration-500 ease-in-out blur-sm rounded-t-full`}>
                        </div>
                        <div className='absolute flex items-center justify-center px-4 py-2'>
                            <img
                                src={team.logoWithName}
                                alt={team.name}
                                className='h-40 w-[300px] md:h-60 md:w-[500px] object-contain'
                            />
                        </div>
                    </div>
                    <div className='absolute'>
                        <img
                            src={team.chassisImage}
                            alt={team.chassis}
                            className='h-[110px] md:h-[139px] object-contain translate-y-[10rem] animate-slide-up-chassis'
                        />
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer className='flex flex-col items-center justify-center pb-20 gap-y-14 text-neutral-100'>
                <div className='flex flex-col items-center justify-center gap-y-4 cursor-default'>
                    <h2 className='font-bold text-6xl font-f1-bold'>
                        {team.name}
                    </h2>
                    <h3 className='font-semibold text-4xl font-f1-regular'>
                        {team.chassis}
                    </h3>
                </div>

                <div className={`flex flex-col items-center justify-center gap-y-6 text-neutral-100 max-w-3xl text-center p-6 ${bgColors[team.id - 1]} rounded-xl`}>
                    <p className='text-md font-medium text-pretty text-neutral-200 font-f1-regular'>
                        {team.description}
                    </p>
                </div>

                <div className='grid grid-cols-[repeat(1,auto)] lg:grid-cols-[repeat(4,1fr)] grid-rows-[repeat(3,auto)] lg:grid-rows-[repeat(1,auto)] gap-4 items-center justify-center'>
                    <div className='order-2 lg:order-1 flex items-center justify-center w-full mt-[12.5rem] lg:pt-0'>
                        <TeamDriver driver={team.drivers[0]} />
                    </div>

                    <div className='order-1 lg:order-2 lg:col-span-2 flex flex-col items-center justify-center gap-y-2'>
                        <TeamRowInfo id={team.id - 1} title='Base: ' content={team.base} />
                        <TeamRowInfo id={team.id - 1} title='GP local: ' content={team.homeRace} />
                        <TeamRowInfo id={team.id - 1} title='Team Chief: ' content={team.teamChief} />
                        <TeamRowInfo id={team.id - 1} title='Technical Chief: ' content={team.technicalChief} />
                        <TeamRowInfo id={team.id - 1} title='Power Unit: ' content={team.powerUnit} />
                        <TeamRowInfo id={team.id - 1} title='First Season: ' content={team.firstTeamEntry} />
                        <TeamRowInfo id={team.id - 1} title='World Championships: ' content={team.worldChampionship} />
                        <TeamRowInfo id={team.id - 1} title='Highest Race Finish: ' content={team.highestRaceFinish} />
                        <TeamRowInfo id={team.id - 1} title='Pole Positions: ' content={team.polePosition} />
                        <TeamRowInfo id={team.id - 1} title='Fastest Laps: ' content={team.fastestLaps} />
                    </div>

                    <div className='order-3 lg:order-3 flex items-center justify-center w-full mt-[12.5rem] lg:pt-0'>
                        <TeamDriver driver={team.drivers[1]} />
                    </div>
                </div>
            </SectionContainer>
        </main>
    )
}
