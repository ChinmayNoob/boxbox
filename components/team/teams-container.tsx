'use client'
import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import TeamLogoCard from '@/components/team/team-logo-card'
import ShinyWrapper from '@/components/common/shiny-wrap'
import { type Team } from '@/types/f1'

type TeamsProps = {
    teams: Team[]
}

const COLS = 4

const TeamsContainer = ({ teams }: TeamsProps) => {
    const stableTeams = [...teams].sort((a, b) => b.currentPointsWC - a.currentPointsWC)

    const [previewTeam, setPreviewTeam] = useState<Team>(stableTeams[0])
    const [animationTrigger, setAnimationTrigger] = useState(0)

    const handleTeamHover = (team: Team) => {
        if (team.id !== previewTeam.id) {
            setPreviewTeam(team)
            setAnimationTrigger(prev => prev + 1)
        }
    }

    const bgCardChassisColor = [
        'bg-gradient-to-l from-[#01a0e8] via-[#01a0e8]/20 to-transparent',
        'bg-gradient-to-l from-[#239970] via-[#239970]/20 to-transparent',
        'bg-gradient-to-l from-[#e90021] via-[#e90021]/20 to-transparent',
        'bg-gradient-to-l from-[#b7bbbd] via-[#b7bbbd]/20 to-transparent',
        'bg-gradient-to-l from-[#53e253] via-[#53e253]/20 to-transparent',
        'bg-gradient-to-l from-[#fe8001] via-[#fe8001]/20 to-transparent',
        'bg-gradient-to-l from-[#26f4d3] via-[#26f4d3]/20 to-transparent',
        'bg-gradient-to-l from-[#062596] via-[#062596]/20 to-transparent',
        'bg-gradient-to-l from-[#3671c6] via-[#3671c6]/20 to-transparent',
        'bg-gradient-to-l from-[#1969db] via-[#1969db]/20 to-transparent',
        'bg-gradient-to-l from-[#b7bbbd] via-[#b7bbbd]/20 to-transparent',
    ]

    const topRow = stableTeams.slice(0, COLS)
    const sideColumn = stableTeams.slice(COLS, COLS + 3)
    const bottomRow = stableTeams.slice(COLS + 3)

    return (
        <motion.div
            className='grid grid-cols-8 gap-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {topRow.map((team, index) => (
                <motion.div
                    key={team.id}
                    className='col-span-2'
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                    }}
                    whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                >
                    <ShinyWrapper hoverOnly={true}>
                        <TeamLogoCard
                            team={team}
                            index={team.id - 1}
                            onHover={() => handleTeamHover(team)}
                        />
                    </ShinyWrapper>
                </motion.div>
            ))}

            <motion.div
                className='col-start-3 col-end-9 row-start-2 row-end-5'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
                <motion.div
                    key={animationTrigger}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.3 }
                    }}
                    className='w-full h-full'
                >
                    <Link
                        href={`/team/${previewTeam.name.replaceAll(' ', '-').toLowerCase()}`}
                        className='block w-full h-full'
                    >
                        <div
                            className={`flex flex-col rounded-3xl backdrop-blur-sm w-full h-full p-5 md:p-6 ${bgCardChassisColor[previewTeam.id - 1]}`}
                        >
                            <div className='flex items-start justify-between'>
                                <motion.div
                                    className='relative'
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <img
                                        src={previewTeam.logo}
                                        alt={previewTeam.name}
                                        className='h-10 md:h-14 object-contain'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent blur-md -z-10'></div>
                                </motion.div>
                                <div className='flex flex-col text-end text-neutral-200'>
                                    <motion.h3
                                        className='text-lg font-f1-bold md:text-3xl font-bold'
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        {previewTeam.name}
                                    </motion.h3>
                                    <motion.h4
                                        className='text-sm md:text-lg font-semibold font-f1-regular text-neutral-400'
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    >
                                        {previewTeam.chassis}
                                    </motion.h4>
                                </div>
                            </div>

                            <div className='flex-1 flex items-center justify-center py-2'>
                                <motion.div
                                    className='w-48 h-14 md:w-80 md:h-24 flex items-center justify-center'
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                                >
                                    <img
                                        style={{ viewTransitionName: 'chassisImage' } as CSSProperties}
                                        src={previewTeam.chassisImage}
                                        alt={previewTeam.chassis}
                                        className='max-w-full max-h-full object-contain'
                                    />
                                </motion.div>
                            </div>

                            <motion.div
                                className='flex items-center justify-between'
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                            >
                                {previewTeam.drivers.slice(0, 2).map((driver, i) => (
                                    <div
                                        key={driver.id}
                                        className={`flex items-center gap-2 md:gap-3 ${i === 1 ? 'flex-row-reverse text-end' : ''}`}
                                    >
                                        <img
                                            src={driver.helmetImage}
                                            alt={driver.name}
                                            className='h-8 md:h-12 w-auto object-contain'
                                        />
                                        <div className='text-neutral-200'>
                                            <p className='text-xs md:text-sm font-f1-bold font-semibold leading-tight'>
                                                {driver.name}
                                            </p>
                                            <p className='text-xs md:text-sm font-f1-regular text-neutral-400'>
                                                #{driver.raceNumber}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>

            {sideColumn.map((team, index) => (
                <motion.div
                    key={team.id}
                    className='col-span-2'
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: (index + COLS) * 0.1,
                        ease: "easeOut"
                    }}
                    whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                >
                    <ShinyWrapper hoverOnly={true}>
                        <TeamLogoCard
                            team={team}
                            index={team.id - 1}
                            onHover={() => handleTeamHover(team)}
                        />
                    </ShinyWrapper>
                </motion.div>
            ))}

            {bottomRow.map((team, index) => (
                <motion.div
                    key={team.id}
                    className='col-span-2'
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: (index + COLS + 3) * 0.1,
                        ease: "easeOut"
                    }}
                    whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                >
                    <ShinyWrapper hoverOnly={true}>
                        <TeamLogoCard
                            team={team}
                            index={team.id - 1}
                            onHover={() => handleTeamHover(team)}
                        />
                    </ShinyWrapper>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default TeamsContainer 