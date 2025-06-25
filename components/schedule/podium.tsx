'use client'
import { type Driver } from '@/types/f1'
import { useState } from 'react'
import { PodiumMember } from './podium-member'
import { PodiumProfile } from './podium-profile'

type podiumProps = {
    podium: Pick<
        Driver,
        | 'id'
        | 'name'
        | 'fullName'
        | 'raceNumber'
        | 'team'
        | 'country'
        | 'countryFlag'
        | 'driverImage'
    >[]
}

const Podium = ({ podium }: podiumProps) => {
    const [activeDriver, setActiveDriver] = useState<typeof podium[0] | null>(
        podium[0] || null
    )

    const handleHover = (driver: typeof podium[0]) => {
        setActiveDriver(driver)
    }

    return (
        <>
            {podium.length > 0 && (
                <div className='flex flex-col items-center justify-center gap-y-10 w-full'>
                    <h3 className='text-xl font-f1-bold md:text-2xl lg:text-3xl font-extrabold text-neutral-200'>
                        GP Podium Position
                    </h3>

                    <div className="flex items-stretch divide-x divide-zinc-800 w-full max-w-screen-xl">
                        <div className="w-3/5 min-w-0 divide-y divide-zinc-800">
                            {podium.map((driver, index) => (
                                <PodiumMember
                                    key={driver.id}
                                    driver={driver}
                                    position={index + 1}
                                    isActive={activeDriver?.id === driver.id}
                                    onHover={() => handleHover(driver)}
                                />
                            ))}
                        </div>

                        <div className="relative w-2/5 flex-shrink-0">
                            {activeDriver && <PodiumProfile driver={activeDriver} />}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Podium
