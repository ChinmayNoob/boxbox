'use client'
import { type Driver } from '@/types/f1'
import { motion } from 'motion/react'

type PodiumProfileProps = {
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
}

export function PodiumProfile({ driver }: PodiumProfileProps) {
    return (
        <div className="absolute inset-0">
            {driver.driverImage ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    key={driver.driverImage}
                    className="h-full w-full"
                >
                    <img
                        src={driver.driverImage}
                        alt={driver.fullName}
                        className="h-full w-full object-contain object-center"
                    />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-zinc-800"
                >
                    <span className="text-6xl font-bold text-zinc-400">
                        {driver.fullName.charAt(0)}
                    </span>
                </motion.div>
            )}
        </div>
    )
} 