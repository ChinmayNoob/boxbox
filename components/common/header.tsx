'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

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
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    return (
        <header className="fixed top-0 left-1/2 font-f1-regular -translate-x-1/2 z-50 w-full max-w-6xl mx-auto shadow-xl backdrop-blur-md text-gray-200">
            {/* Desktop Navigation */}
            <nav className="hidden sm:flex flex-row items-center justify-center text-base md:text-lg font-medium mx-auto mt-2 py-0 px-6 gap-x-6">
                <Link
                    href={firstAnchorRef || "#"}
                    className="flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Calender
                </Link>
                <Link
                    href={secondAnchorRef || "#"}
                    className="flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Results
                </Link>
                <div className="flex justify-center items-center px-6 transition-transform duration-700 hover:scale-110 hover:animate-custom-pulse">
                    <Link href="/" className="relative">
                        <Image
                            src="/images/logos/logof1White.webp"
                            alt="F1 Logo"
                            width={256}
                            height={256}
                            className="h-full translate-y-4"
                        />
                    </Link>
                </div>
                <Link
                    href={thirdAnchorRef || "#"}
                    className="flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Teams
                </Link>
                <Link
                    href={fourAnchorRef || "#"}
                    className="flex items-center justify-center transition duration-500 hover:text-[#f41d00] hover:scale-110"
                >
                    Drivers
                </Link>
            </nav>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/logos/logof1White.webp"
                        alt="F1 Logo"
                        width={120}
                        height={120}
                        className="h-8 w-auto"
                    />
                </Link>

                {/* Menu Toggle Button */}
                <button
                    onClick={toggleMenu}
                    className="flex items-center justify-center w-8 h-8 transition-all duration-300"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6 text-gray-200" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-200" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`sm:hidden absolute top-full bg-black/95 left-0 w-full backdrop-blur-md transition-all duration-300 ${isMenuOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-4'
                    }`}
            >
                <nav className="flex flex-col py-4 px-6 space-y-4">
                    <Link
                        href={firstAnchorRef || "#"}
                        onClick={closeMenu}
                        className="text-lg font-medium transition duration-300 hover:text-[#f41d00] py-2"
                    >
                        Calender
                    </Link>
                    <Link
                        href={secondAnchorRef || "#"}
                        onClick={closeMenu}
                        className="text-lg font-medium transition duration-300 hover:text-[#f41d00] py-2"
                    >
                        Results
                    </Link>
                    <Link
                        href={thirdAnchorRef || "#"}
                        onClick={closeMenu}
                        className="text-lg font-medium transition duration-300 hover:text-[#f41d00] py-2"
                    >
                        Teams
                    </Link>
                    <Link
                        href={fourAnchorRef || "#"}
                        onClick={closeMenu}
                        className="text-lg font-medium transition duration-300 hover:text-[#f41d00] py-2"
                    >
                        Drivers
                    </Link>
                </nav>
            </div>

            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent"></div>
        </header>
    )
}