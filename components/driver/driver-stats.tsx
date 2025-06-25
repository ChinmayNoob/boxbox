'use client'
import { type Driver } from '@/types/f1'
import { motion } from 'motion/react'
import { useState } from 'react'

type DriverStatsProps = {
    driver: Pick<
        Driver,
        | 'team'
        | 'country'
        | 'podiums'
        | 'wins'
        | 'points'
        | 'currentPointsDWC'
        | 'grandsPrixEntered'
        | 'worldChampionships'
        | 'highestRaceFinish'
        | 'dateOfBirth'
        | 'placeOfBirth'
        | 'age'
        | 'homeRace'
        | 'id'
    >
}

const bgColors = [
    'bg-[#01a0e8]',
    'bg-[#239970]',
    'bg-[#e90021]',
    'bg-[#b7bbbd]',
    'bg-[#53e253]',
    'bg-[#fe8001]',
    'bg-[#26f4d3]',
    'bg-[#243d97]',
    'bg-[#3671c6]',
    'bg-[#1969db]'
]

export function DriverStats({ driver }: DriverStatsProps) {
    const [hoveredStat, setHoveredStat] = useState<string | null>(null)

    const stats = [
        { id: 'team', label: 'Team', value: driver.team },
        { id: 'country', label: 'Country', value: driver.country },
        { id: 'wins', label: 'Career Wins', value: driver.wins },
        { id: 'podiums', label: 'Podiums', value: driver.podiums },
        { id: 'points', label: 'Career Points', value: driver.points },
        { id: 'currentPoints', label: 'Current Season Points', value: driver.currentPointsDWC },
        { id: 'championships', label: 'World Championships', value: driver.worldChampionships },
        { id: 'grandsPrix', label: 'Grands Prix Entered', value: driver.grandsPrixEntered },
        { id: 'highestFinish', label: 'Highest Race Finish', value: driver.highestRaceFinish },
        { id: 'age', label: 'Age', value: driver.age },
        { id: 'dateOfBirth', label: 'Date of Birth', value: driver.dateOfBirth },
        { id: 'placeOfBirth', label: 'Place of Birth', value: driver.placeOfBirth },
        { id: 'homeRace', label: 'Home Race', value: driver.homeRace }
    ]

    return (
        <div className='w-full space-y-1'>
            {stats.map((stat) => (
                <motion.div
                    key={stat.id}
                    className={`cursor-pointer p-2 rounded transition-all duration-300 hover:bg-zinc-900/50 ${hoveredStat === stat.id ? 'bg-zinc-900' : 'bg-zinc-800/30'
                        }`}
                    onMouseEnter={() => setHoveredStat(stat.id)}
                    onMouseLeave={() => setHoveredStat(null)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                >
                    <div className="flex items-center justify-between font-f1-regular">
                        <div className="flex items-center gap-2 flex-1">
                            <motion.div
                                className={`w-1 h-6 ${bgColors[Math.floor((driver.id - 1) / 2)]} rounded-full`}
                                animate={{ scaleY: hoveredStat === stat.id ? 1.1 : 1 }}
                                transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                            />

                            <div className="flex-1">
                                <motion.h3
                                    className={`font-medium text-xs tracking-wide transition-colors duration-300 ${hoveredStat === stat.id ? 'text-zinc-200' : 'text-zinc-400'
                                        }`}
                                    animate={{ y: hoveredStat === stat.id ? -0.5 : 0 }}
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                >
                                    {stat.label}
                                </motion.h3>
                            </div>
                        </div>

                        <motion.div
                            className="text-right"
                            animate={{ scale: hoveredStat === stat.id ? 1.02 : 1 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                        >
                            <span className={`text-sm font-semibold transition-colors duration-300 ${hoveredStat === stat.id ? 'text-white' : 'text-zinc-200'
                                }`}>
                                {stat.value}
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
} 