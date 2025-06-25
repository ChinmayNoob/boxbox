'use client'
import { motion } from 'motion/react'
import { useState } from 'react'

interface TeamRowInfoProps {
    id: number
    title: string
    content: string
}

const TeamRowInfo = ({ id, title, content }: TeamRowInfoProps) => {
    const [isHovered, setIsHovered] = useState(false)

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

    const bgHoverColors = [
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50',
        'hover:bg-zinc-900/50'
    ]

    return (
        <motion.div
            className={`cursor-pointer p-3 rounded-lg transition-all duration-300 ${bgHoverColors[id]} ${isHovered ? 'bg-zinc-900' : 'bg-zinc-800/30'} w-full`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
        >
            <div className="flex items-center justify-between font-f1-regular">
                <div className="flex items-center gap-3 flex-1">
                    <motion.div
                        className={`w-1 h-6 ${bgColors[id]} rounded-full`}
                        animate={{ scaleY: isHovered ? 1.2 : 1 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                    />

                    <motion.h2
                        className={`font-medium text-sm tracking-wide transition-colors duration-300 ${isHovered ? 'text-zinc-200' : 'text-zinc-400'}`}
                        animate={{ y: isHovered ? -0.5 : 0 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                    >
                        {title}
                    </motion.h2>
                </div>

                <motion.div
                    className="text-right"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                >
                    <h3 className={`text-base font-semibold transition-colors duration-300 ${isHovered ? 'text-white' : 'text-zinc-200'}`}>
                        {content}
                    </h3>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default TeamRowInfo 