import { type Driver } from '@/types/f1'
import Image from 'next/image'
import Link from 'next/link'

type TeamDriverProps = {
    driver: Driver
}

const TeamDriver = ({ driver }: TeamDriverProps) => {
    const bgColors = [
        'bg-[#294961]/30',
        'bg-[#1f363b]/30',
        'bg-[#732b40]/30',
        'bg-[#565862]/30',
        'bg-[#246d31]/30',
        'bg-[#704c38]/30',
        'bg-[#2f6f71]/30',
        'bg-[#435364]/30',
        'bg-[#34476c]/30',
        'bg-[#355f74]/30',
        'bg-[#355f74]/30',
    ]

    return (
        <Link
            href={`/driver/${driver.name.replaceAll(' ', '-').toLowerCase()}`}
            className='flex flex-col items-center justify-center w-[240px] h-[100px] hover:-translate-y-2 transition-transform duration-300 ease-in-out group'
        >
            <div className='absolute'>
                <Image
                    src={driver.driverImage}
                    alt={driver.name}
                    width={220}
                    height={220}
                    className='h-[220px] object-contain -translate-y-36'
                />
            </div>

            <div
                className={`flex flex-col items-center justify-center gap-y-2 py-4 w-full ${bgColors[Math.floor((driver.id - 1) / 2)]
                    } transition-colors duration-300 ease-in-out backdrop-blur-md rounded-xl`}
            >
                <h3 className='text-neutral-100 text-xl font-semibold font-f1-bold'>
                    {driver.fullName} {driver.raceNumber}
                </h3>
                <Image
                    src={driver.countryFlag}
                    alt={driver.country}
                    width={24}
                    height={24}
                    className='h-6 object-contain'
                />
            </div>
        </Link>
    )
}

export default TeamDriver 