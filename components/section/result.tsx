'use client'
import ResultsContainer from '@/components/result/result-container'
import { type Team } from '@/types/f1'
import SectionContainer from '@/components/common/section-container'

type ResultProps = {
    teams: Team[]
}

const Result = ({ teams }: ResultProps) => {
    return (
        <SectionContainer>
            <div className='flex flex-col items-center justify-center gap-y-6'>
                <div className='flex flex-col items-center justify-center p-4'>
                    <h2 className='font-f1-wide text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-200'>
                        2025 F1 Season Results
                    </h2>
                </div>

                <div className='h-[2px] w-full bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent'>
                </div>

                <ResultsContainer teams={teams} />
            </div>
        </SectionContainer>
    )
}

export default Result
