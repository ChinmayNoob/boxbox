import { type Team } from '@/types/f1'
import { motion } from 'motion/react'
import { useState } from 'react'

type resultsContainerProps = {
    teams: Team[]
}

const ResultsContainer = ({ teams }: resultsContainerProps) => {
    const [hoveredTeam, setHoveredTeam] = useState<number | null>(null)
    const [hoveredDriver, setHoveredDriver] = useState<number | null>(null)

    const sortedTeams = teams.sort(
        (a, b) => b.currentPointsWC - a.currentPointsWC
    )

    const sortedDrivers = teams
        .flatMap((team) => team.drivers)
        .sort((a, b) => b.currentPointsDWC - a.currentPointsDWC)


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

    return (
        <div className='flex flex-col items-center justify-center gap-y-16'>
            {/* Constructor Championships */}
            <div className='flex flex-col items-center justify-center gap-y-6 w-full max-w-4xl'>
                <h3 className='font-f1-bold text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-200'>
                    Constructors Championship 2025
                </h3>

                <div className='w-full space-y-3'>
                    {sortedTeams.map((team, i) => (
                        <motion.div
                            key={team.id}
                            className={`cursor-pointer p-5 rounded-lg transition-all duration-400 hover:bg-zinc-900/50 ${hoveredTeam === team.id ? 'bg-zinc-900' : 'bg-zinc-800/30'
                                }`}
                            onMouseEnter={() => setHoveredTeam(team.id)}
                            onMouseLeave={() => setHoveredTeam(null)}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                        >
                            <div className="flex items-center justify-between font-f1-regular">
                                <div className="flex items-center gap-5 flex-1">
                                    <motion.div
                                        className={`w-2 h-12 ${bgColors[team.id - 1]} rounded-full`}
                                        animate={{ scaleY: hoveredTeam === team.id ? 1.2 : 1 }}
                                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-1">
                                            <motion.span
                                                className="text-2xl font-bold text-yellow-400"
                                                animate={{ scale: hoveredTeam === team.id ? 1.1 : 1 }}
                                                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                            >
                                                {i + 1}
                                            </motion.span>
                                            <motion.h3
                                                className={`font-bold text-lg tracking-wider transition-colors duration-400 ${hoveredTeam === team.id ? 'text-zinc-200' : 'text-zinc-400'
                                                    }`}
                                                animate={{ y: hoveredTeam === team.id ? -2 : 0 }}
                                                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                            >
                                                <a
                                                    href={`/team/${team.name
                                                        .replaceAll(' ', '-')
                                                        .toLowerCase()}`}
                                                    className="hover:underline"
                                                >
                                                    {team.fullName}
                                                </a>
                                            </motion.h3>
                                        </div>
                                    </div>
                                </div>

                                <motion.div
                                    className="text-right"
                                    animate={{ scale: hoveredTeam === team.id ? 1.1 : 1 }}
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                >
                                    <span className="text-xl font-bold text-zinc-200">
                                        {team.currentPointsWC}
                                    </span>
                                    <span className="text-sm text-zinc-400 ml-1">pts</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className='h-[2px] w-full bg-gradient-to-r from-transparent via-neutral-100/60 to-transparent'></div>

            {/* Driver Championships */}
            <div className='flex flex-col items-center justify-center gap-y-10 w-full max-w-4xl'>
                <div className='mb-8 lg:mb-24'>
                    <h3 className='font-f1-bold text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-200'>
                        Drivers Championship 2025
                    </h3>
                </div>

                {/* Top 3 Podium Display */}
                <div className='flex flex-col md:flex-row items-center justify-evenly w-full gap-y-24 md:gap-y-0 md:gap-x-16 pt-8 md:pt-20'>
                    {sortedDrivers.slice(0, 3).map((driver, i) => (
                        <motion.a
                            key={driver.id}
                            href={`/driver/${driver.name.replaceAll(' ', '-').toLowerCase()}`}
                            className={`flex flex-col items-center justify-center w-[180px] sm:w-[200px] lg:w-[230px] h-[100px] group ${i === 0
                                ? 'order-1 md:order-2 md:scale-105'
                                : i === 1
                                    ? 'order-2 md:order-1'
                                    : 'order-3 md:order-3'
                                }`}
                            whileHover={{ y: -8, scale: i === 0 ? 1.1 : 1.05 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                        >
                            <div className='absolute'>
                                <motion.img
                                    src={driver.driverImage}
                                    alt={driver.name}
                                    className={`h-32 sm:h-36 md:h-40 object-contain -translate-y-16 sm:-translate-y-18 md:-translate-y-20`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            <div
                                className={`w-full ${bgColors[Math.floor((driver.id - 1) / 2)]
                                    } h-[6px] rounded-t-xl`}
                            >
                                <span className='font-f1-regular text-neutral-100 font-bold text-5xl sm:text-6xl md:text-7xl absolute -translate-y-12 sm:-translate-y-14 md:-translate-y-16 translate-x-2'>
                                    {i + 1}
                                </span>
                            </div>
                            <div className='flex flex-col items-center justify-center gap-y-2 py-3 sm:py-4 w-full bg-zinc-700/30 group-hover:bg-neutral-100/10 transition-colors duration-300 ease-in-out backdrop-blur-md rounded-b-xl'>
                                <h3 className='font-f1-regular text-neutral-100 text-lg sm:text-xl font-semibold text-center'>
                                    {driver.fullName}
                                </h3>
                                <img
                                    src={driver.countryFlag}
                                    alt={driver.country}
                                    className='h-5 sm:h-6 object-contain'
                                />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* All Drivers List */}
                <div className='w-full space-y-3 mt-12'>
                    {sortedDrivers.map((driver, i) => (
                        <motion.div
                            key={driver.id}
                            className={`cursor-pointer p-5 rounded-lg transition-all duration-400 hover:bg-zinc-900/50 ${hoveredDriver === driver.id ? 'bg-zinc-900' : 'bg-zinc-800/30'
                                }`}
                            onMouseEnter={() => setHoveredDriver(driver.id)}
                            onMouseLeave={() => setHoveredDriver(null)}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                        >
                            <div className="flex items-center justify-between font-f1-regular">
                                <div className="flex items-center gap-5 flex-1">
                                    <motion.div
                                        className={`w-2 h-12 ${bgColors[Math.floor((driver.id - 1) / 2)]} rounded-full`}
                                        animate={{ scaleY: hoveredDriver === driver.id ? 1.2 : 1 }}
                                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-1">
                                            <motion.span
                                                className="text-2xl font-bold text-yellow-400"
                                                animate={{ scale: hoveredDriver === driver.id ? 1.1 : 1 }}
                                                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                            >
                                                {i + 1}
                                            </motion.span>
                                            <motion.h3
                                                className={`font-bold text-lg tracking-wider transition-colors duration-400 ${hoveredDriver === driver.id ? 'text-zinc-200' : 'text-zinc-400'
                                                    }`}
                                                animate={{ y: hoveredDriver === driver.id ? -2 : 0 }}
                                                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                            >
                                                <a
                                                    href={`/driver/${driver.name
                                                        .replaceAll(' ', '-')
                                                        .toLowerCase()}`}
                                                    className="hover:underline"
                                                >
                                                    {driver.fullName}
                                                </a>
                                            </motion.h3>
                                            <motion.img
                                                src={driver.countryFlag}
                                                alt={driver.country}
                                                className="h-5 object-contain ml-3 hidden sm:block"
                                                animate={{ scale: hoveredDriver === driver.id ? 1.1 : 1 }}
                                                transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                            />
                                        </div>

                                        <motion.div
                                            className="flex items-center gap-3 text-sm"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                height: hoveredDriver === driver.id ? 'auto' : 0,
                                                opacity: hoveredDriver === driver.id ? 1 : 0
                                            }}
                                            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                        >
                                            <p className="text-zinc-400 uppercase tracking-wide">
                                                <a
                                                    href={`/team/${driver.team
                                                        .replaceAll(' ', '-')
                                                        .toLowerCase()}`}
                                                    className="hover:underline"
                                                >
                                                    {driver.team}
                                                </a>
                                            </p>
                                            <span className="text-zinc-500">•</span>
                                            <p className="text-zinc-400 uppercase tracking-wide">
                                                {driver.country}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.div
                                    className="text-right"
                                    animate={{ scale: hoveredDriver === driver.id ? 1.1 : 1 }}
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                >
                                    <span className="text-xl font-bold text-zinc-200">
                                        {driver.currentPointsDWC}
                                    </span>
                                    <span className="text-sm text-zinc-400 ml-1">pts</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ResultsContainer
