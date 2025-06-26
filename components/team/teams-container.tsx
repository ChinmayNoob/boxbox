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

const TeamsContainer = ({ teams }: TeamsProps) => {
    // Create a stable copy of teams sorted by points (high to low) to prevent reordering
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
        'bg-gradient-to-l from-[#1969db] via-[#1969db]/20 to-transparent'
    ]

    const logoPlacement = [
        '',
        'md:-translate-x-2 lg:translate-x-0',
        '',
        'translate-x-6',
        'md:translate-x-10 lg:translate-x-12',
        'translate-x-2',
        'translate-x-6',
        'md:translate-x-2 lg:translate-x-6',
        'md:translate-x-2 lg:translate-x-0',
        'md:translate-x-4 lg:translate-x-6'
    ]

    return (
        <motion.div
            className='grid grid-cols-[repeat(4,1fr)] grid-rows-[repeat(3,auto)] gap-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {stableTeams.slice(0, 5).map((team, index) => (
                <motion.div
                    key={team.id}
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
                className='flex flex-col items-center justify-center col-span-2'
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
                        scale: 1.05,
                        transition: { duration: 0.3 }
                    }}
                    className='w-full'
                >
                    <Link
                        href={`/team/${previewTeam.name.replaceAll(' ', '-').toLowerCase()}`}
                        className='flex w-full'
                    >
                        <div
                            className={`flex rounded-r-3xl border-0 backdrop-blur-sm w-full h-22 items-center justify-end ${bgCardChassisColor[previewTeam.id - 1]
                                }`}
                        >
                            <div className='flex flex-col text-end pr-4 text-neutral-200'>
                                <motion.h3
                                    className='text-xl font-f1-bold md:text-4xl font-bold'
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    {previewTeam.name}
                                </motion.h3>
                                <motion.h4
                                    className='text-md md:text-xl font-semibold font-f1-regular'
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    {previewTeam.chassis}
                                </motion.h4>
                            </div>
                        </div>

                        <motion.div
                            className={`absolute ${logoPlacement[previewTeam.id - 1]
                                } md:-translate-y-8`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <img
                                src={previewTeam.logo}
                                alt={previewTeam.name}
                                className='h-0 md:h-20'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent blur-md'></div>
                        </motion.div>
                        <motion.img
                            style={{ viewTransitionName: 'chassisImage' } as CSSProperties}
                            src={previewTeam.chassisImage}
                            alt={previewTeam.name}
                            className='absolute h-14 translate-y-12 md:h-24 md:translate-y-6'
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                        />
                    </Link>
                </motion.div>
            </motion.div>

            {stableTeams.slice(5).map((team, index) => (
                <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: (index + 5) * 0.1,
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