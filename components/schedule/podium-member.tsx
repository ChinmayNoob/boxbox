'use client'
import { type Driver } from '@/types/f1'
import { motion } from 'motion/react'

type PodiumMemberProps = {
    driver: Pick<
        Driver,
        | 'id'
        | 'name'
        | 'fullName'
        | 'raceNumber'
        | 'team'
        | 'country'
        | 'countryFlag'
        | 'driverImage'
    >
    position: number
    isActive: boolean
    onHover: () => void
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

const positionColors = {
    1: 'text-yellow-400',
    2: 'text-gray-300',
    3: 'text-amber-600'
}

export function PodiumMember({ driver, position, isActive, onHover }: PodiumMemberProps) {
    const teamColorClass = bgColors[Math.floor((driver.id - 1) / 2)]
    const positionColorClass = positionColors[position as keyof typeof positionColors] || 'text-zinc-400'

    return (
        <div
            className={`cursor-pointer p-6 transition-all duration-400 hover:bg-zinc-900/50 ${isActive ? 'bg-zinc-900' : ''
                }`}
            onMouseEnter={onHover}
        >
            <div className="flex items-center justify-between font-f1-regular">
                <div className="flex items-center gap-4 flex-1">
                    <motion.div
                        className={`w-2 h-16 ${teamColorClass} rounded-full`}
                        animate={{ scaleY: isActive ? 1.2 : 1 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                    />

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <motion.span
                                className={`text-3xl font-bold ${positionColorClass}`}
                                animate={{ scale: isActive ? 1.1 : 1 }}
                                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                            >
                                {position}
                            </motion.span>
                            <motion.h3
                                className={`font-bold text-xl tracking-wider transition-colors duration-400 ${isActive ? 'text-zinc-200' : 'text-zinc-400'
                                    }`}
                                animate={{ y: isActive ? -2 : 0 }}
                                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                            >
                                {driver.fullName}
                            </motion.h3>
                        </div>

                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                                height: isActive ? 'auto' : 0,
                                opacity: isActive ? 1 : 0
                            }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                        >
                            <p className="text-zinc-400 uppercase tracking-wide">
                                {driver.team}
                            </p>
                            <span className="text-zinc-500">•</span>
                            <p className="text-zinc-400 uppercase tracking-wide">
                                #{driver.raceNumber}
                            </p>
                        </motion.div>
                    </div>
                </div>

                <motion.img
                    src={driver.countryFlag}
                    alt={driver.country}
                    className="h-6 object-contain"
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                />
            </div>
        </div>
    )
} 