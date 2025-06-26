'use client'
import Link from 'next/link'
import { type Team } from '@/types/f1'

type TeamProps = {
    team: Team
    index: number
    onHover: () => void
}

const TeamLogoCard = ({ team, index, onHover }: TeamProps) => {
    const colors = [
        'bg-gradient-to-b from-[#091727] via-[#0a1b2b] to-[#081c2f] shadow-[#194f71]',
        'bg-gradient-to-b from-[#024841] via-[#044c46] to-[#006256] shadow-[#214844]',
        'bg-gradient-to-b from-[#c60505] via-[#db0402] to-[#f20300] shadow-[#812a4a]',
        'bg-gradient-to-b from-[#dedcdd] via-[#eaebeb] to-[#f6f6f7] shadow-[#61667c]',
        'bg-gradient-to-b from-[#2e2e2f] via-[#111111] to-[#000001] shadow-[#1f5e1e]',
        'bg-gradient-to-b from-[#d67704] via-[#de7d06] to-[#f68702] shadow-[#9b5629]',
        'bg-gradient-to-b from-[#05b29e] via-[#02d3b8] to-[#01ecce] shadow-[#1b766a]',
        'bg-gradient-to-b from-[#062596] via-[#0f31b0] to-[#173cc9] shadow-[#223091]',
        'bg-gradient-to-b from-[#0726a5] via-[#0f33bd] to-[#1538c8] shadow-[#25557c]',
        'bg-gradient-to-b from-[#0202af] via-[#0505d2] to-[#0305f4] shadow-[#1b3a86]'
    ]

    return (
        <Link
            href={`/team/${team.name.replaceAll(' ', '-').toLowerCase()}`}
            className={`flex items-center justify-center shadow-lg ${colors[index]} border-2 border-[#ecf3f6]/50 hover:border-[#ecf3f6] rounded-md py-10 md:py-20 transition duration-500 ease-in-out hover:scale-105`}
            onMouseEnter={onHover}
        >
            <img
                src={team.logo}
                alt={team.name}
                className='h-10 md:h-20 object-contain'
            />
        </Link>
    )
}

export default TeamLogoCard 