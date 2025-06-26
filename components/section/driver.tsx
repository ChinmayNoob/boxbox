'use client'
import DriversContainer from '@/components/driver/drivers-container'
import { type Team } from '@/types/f1'
import SectionContainer from '@/components/common/section-container'

type DriverProps = {
    teams: Team[]
}

const Driver = ({ teams }: DriverProps) => {
    return (
        <SectionContainer>
            <div className='flex flex-col items-center justify-center gap-y-8'>
                <div className='flex flex-col items-center justify-center gap-y-4 p-4'>
                    <h2 className='font-f1-wide text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-200'>
                        2025 F1 Drivers
                    </h2>
                    <p className='text-center font-f1-regular text-md lg:text-lg max-w-3xl font-bold text-neutral-300'>
                        Take a look at the official F1 lineup for this season. Complete breakdown of drivers, points and current positions. Follow your favorite F1 drivers on and off the track.
                    </p>
                </div>

                <div className='h-[2px] w-full bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent'>
                </div>

                <DriversContainer teams={teams} />
            </div>
        </SectionContainer>
    )
}

export default Driver
