'use client'
import TeamsContainer from '@/components/team/teams-container'
import { type Team } from '@/types/f1'
import SectionContainer from '@/components/common/section-container'

type TeamProps = {
    teams: Team[]
}

const Team = ({ teams }: TeamProps) => {
    return (
        <SectionContainer>
            <div className='flex flex-col items-center justify-center gap-y-8'>
                <div className='flex flex-col items-center justify-center gap-y-4 p-4'>
                    <h2 className='font-f1-wide text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-200'>
                        2025 F1 Teams
                    </h2>
                    <p className='text-center font-f1-regular text-md lg:text-lg max-w-3xl font-bold text-neutral-300'>
                        Discover everything you need to know about this year&apos;s Formula 1 teams: drivers, podiums, points earned and constructor championship titles.
                    </p>
                </div>

                <div className='h-[2px] w-full bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent'>
                </div>

                <TeamsContainer teams={teams} />
            </div>
        </SectionContainer>
    )
}

export default Team
