'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const Hero = () => {
    const [scrollOpacity, setScrollOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const heroHeight = window.innerHeight * 0.8; // 80% of viewport height

            // Calculate opacity based on scroll position
            // Opacity goes from 1 to 0 as we scroll from 0 to heroHeight
            const opacity = Math.max(0, 1 - (scrolled / heroHeight));
            setScrollOpacity(opacity);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col">
            <motion.div
                className='relative group flex-1 flex items-center justify-center'
                style={{ opacity: scrollOpacity }}
                transition={{ duration: 0.1 }}
            >
                <img
                    src='/images/logos/logof1.webp'
                    alt='f1 logo'
                    className='h-36 object-contain blur-sm opacity-20 translate-y-10 translate-x-6
                     transition duration-500 ease-in-out group-hover:scale-[1.3]
                      delay-200 group-hover:opacity-0'
                />
                <div className='absolute inset-0 flex items-center justify-center'>
                    <img
                        src='/images/logos/logof1.webp'
                        alt='f1 logo'
                        className='h-40 object-contain transition-transform duration-500 ease-in-out transform group-hover:-translate-y-2'
                    />
                </div>
            </motion.div>

            <motion.div
                className='flex flex-col items-center justify-center pb-8'
                style={{ opacity: scrollOpacity }}
                transition={{ duration: 0.1 }}
            >
                <h1 className='text-3xl font-f1-bold text-center text-white opacity-40 mb-4'>Scroll</h1>
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="cursor-pointer"
                    onClick={() => {
                        window.scrollTo({
                            top: window.innerHeight * 0.8,
                            behavior: 'smooth'
                        });
                    }}
                >
                    <Image
                        src="/down.svg"
                        alt="Scroll down"
                        width={32}
                        height={32}
                        className="filter invert opacity-40 hover:opacity-100 transition-opacity duration-300"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
