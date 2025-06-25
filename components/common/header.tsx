import Image from 'next/image'
import Link from 'next/link'

interface HeaderProps {
    firstAnchorRef?: string
    secondAnchorRef?: string
    thirdAnchorRef?: string
    fourAnchorRef?: string
}

export default function Header({
    firstAnchorRef,
    secondAnchorRef,
    thirdAnchorRef,
    fourAnchorRef
}: HeaderProps) {
    return (
        <header className="fixed top-0 left-1/2 font-onest -translate-x-1/2 z-12 w-full max-w-6xl mx-auto shadow-xl backdrop-blur-md text-gray-200">
            <nav className="flex flex-col sm:flex-row items-center justify-center text-base md:text-lg font-medium mx-auto mt-3 sm:mt-2 py-0 px-6 gap-x-6 gap-y-3">
                <Link
                    href={firstAnchorRef || "#"}
                    className="order-1 flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Calender
                </Link>
                <Link
                    href={secondAnchorRef || "#"}
                    className="order-2 flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Results
                </Link>
                <div className="order-5 sm:order-3 flex justify-center items-center px-6 transition-transform duration-700 hover:scale-110 hover:animate-custom-pulse">
                    <Link href="/" className="relative">
                        <Image
                            src="/images/logos/logof1White.webp"
                            alt="F1 Logo"
                            width={256}
                            height={256}
                            className="h-full translate-y-3 sm:translate-y-4"
                        />
                    </Link>
                </div>
                <Link
                    href={thirdAnchorRef || "#"}
                    className="order-3 sm:order-3 flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Teams
                </Link>
                <Link
                    href={fourAnchorRef || "#"}
                    className="order-4 flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Drivers
                </Link>
            </nav>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent"></div>
        </header>
    )
}
