'use client'
import { useState } from 'react'
import { type Team, type Driver } from '@/types/f1'
import MiniDriverCard from '@/components/driver/mini-driver-card'
import DriverPreview from '@/components/driver/driver-preview'

type driversContainerProps = {
    teams: Team[]
}

// Diamond/kite formation: [x, y] offsets from center point
// 5 paired rows widening then narrowing, plus a single bottom anchor
const DIAMOND_POSITIONS: [number, number][] = [
    [-170, -280], [170, -280],
    [-290, -145], [290, -145],
    [-360, 0],    [360, 0],
    [-290, 145],  [290, 145],
    [-170, 280],  [170, 280],
    [0, 450],
]

const CONTAINER_WIDTH = 1040
const CONTAINER_HEIGHT = 1010
const CENTER_Y = 360

const DriversContainer = ({ teams }: driversContainerProps) => {
    const [previewDriver, setPreviewDriver] = useState<Driver>(
        teams[0].drivers[0]
    )

    const sortedTeams = [...teams].sort((a, b) => a.id - b.id)

    const renderTeamCard = (team: Team) => (
        <>
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
        </>
    )

    return (
        <div className='flex flex-col items-center justify-center w-full'>
            {/* Grid layout for screens below xl */}
            <div className='xl:hidden'>
                <div className='grid md:grid-cols-2 gap-x-4 gap-y-2'>
                    {sortedTeams.map((team, index) => (
                        <div
                            key={team.id}
                            className={`text-white flex flex-row items-center justify-center gap-2 ${
                                index === sortedTeams.length - 1 &&
                                sortedTeams.length % 2 !== 0
                                    ? 'md:col-span-2'
                                    : ''
                            }`}
                        >
                            {renderTeamCard(team)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Diamond layout for xl+ */}
            <div className='hidden xl:block'>
                <div
                    className='relative mx-auto'
                    style={{
                        width: `${CONTAINER_WIDTH}px`,
                        height: `${CONTAINER_HEIGHT}px`,
                    }}
                >
                    {/* Center preview */}
                    <div
                        className='absolute z-20'
                        style={{
                            left: '50%',
                            top: `${CENTER_Y}px`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <DriverPreview previewDriver={previewDriver} />
                    </div>

                    {/* Team cards in diamond formation */}
                    {sortedTeams.map((team, index) => {
                        const pos = DIAMOND_POSITIONS[index]
                        if (!pos) return null
                        const [x, y] = pos

                        return (
                            <div
                                key={team.id}
                                className='absolute text-white flex flex-row items-center justify-center gap-2'
                                style={{
                                    left: '50%',
                                    top: `${CENTER_Y + y}px`,
                                    transform: `translate(calc(-50% + ${x}px), -50%)`,
                                    zIndex: Math.floor(index / 2) + 1,
                                }}
                            >
                                {renderTeamCard(team)}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default DriversContainer
