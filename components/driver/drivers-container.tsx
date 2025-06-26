'use client'
import { useState } from 'react'
import { type Team, type Driver } from '@/types/f1'
import MiniDriverCard from '@/components/driver/mini-driver-card'
import DriverPreview from '@/components/driver/driver-preview'

type driversContainerProps = {
    teams: Team[]
}

const DriversContainer = ({ teams }: driversContainerProps) => {
    const [previewDriver, setPreviewDriver] = useState<Driver>(
        teams[0].drivers[0]
    )

    const padding = [
        'lg:-translate-x-4',
        'lg:translate-x-4',
        'md:-translate-x-12 lg:-translate-x-26',
        'md:translate-x-12 lg:translate-x-26',
        'md:-translate-x-20 lg:-translate-x-50',
        'md:translate-x-20 lg:translate-x-50',
        'md:-translate-x-12 lg:-translate-x-26',
        'md:translate-x-12 lg:translate-x-26',
        'lg:-translate-x-4',
        'lg:translate-x-4'
    ]

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='grid md:grid-cols-[repeat(2,1fr)] md:grid-rows-[repeat(5,auto)] gap-x-4 gap-y-2'>
                {teams
                    .sort((a, b) => a.id - b.id)
                    .map((team) => (
                        <div
                            key={team.id}
                            className={`text-white flex flex-row items-center justify-center gap-2 ${padding[team.id - 1]
                                }`}
                        >
                            <MiniDriverCard
                                driver={team.drivers[0]}
                                teamId={team.id}
                                onHover={() => setPreviewDriver(team.drivers[0])}
                            />
                            <a
                                href={`/team/${team.name.replaceAll(' ', '-').toLowerCase()}`}
                                className='absolute'
                            >
                                <img
                                    src={team.logo}
                                    alt={team.name}
                                    className='h-10 object-contain transition-transform duration-300 ease-in-out hover:scale-125 hover:animate-custom-pulse'
                                />
                            </a>
                            <MiniDriverCard
                                driver={team.drivers[1]}
                                teamId={team.id}
                                onHover={() => setPreviewDriver(team.drivers[1])}
                            />
                        </div>
                    ))}
            </div>

            <DriverPreview previewDriver={previewDriver} />
        </div>
    )
}

export default DriversContainer 