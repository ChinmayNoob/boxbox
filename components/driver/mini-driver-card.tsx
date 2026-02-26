import { type Driver } from '@/types/f1'

type MiniDriverCardProps = {
    driver: Driver
    teamId: number
    onHover: () => void
}

const MiniDriverCard = ({ driver, teamId, onHover }: MiniDriverCardProps) => {
    const bgColor = [
        'bg-[#0c1c2c] text-[#3574c6]',
        'bg-[#24584e]',
        'bg-[#ea0006]',
        'bg-[#b7bbbd] text-zinc-800',
        'bg-[#010001] text-[#69e90f]',
        'bg-[#f17f04]',
        'bg-[#46a09b] text-zinc-800',
        'bg-[#2324d1]',
        'bg-[#161960]',
        'bg-[#0b1b55] text-[#489edb]',
        'bg-[#b7bbbd] text-zinc-800',
    ]

    return (
        <a
            href={`/driver/${driver.name.replaceAll(' ', '-').toLowerCase()}`}
            onMouseEnter={onHover}
            className='flex flex-col items-center justify-center transition-transform duration-500 ease-in-out hover:animate-heartbeat hover:-translate-y-1'
        >
            <img
                src={driver.driverImage}
                alt={driver.name}
                className='h-30 object-contain translate-y-4'
            />
            <div className='relative w-38 h-8 mx-auto'>
                <div
                    className={`absolute inset-0 ${bgColor[teamId - 1]
                        } transform -skew-x-48`}
                >
                    <div className='flex items-center justify-center h-full transform skew-x-48'>
                        <span className='font-bold text-xl font-f1-bold'>{driver.name}</span>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default MiniDriverCard 