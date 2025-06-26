'use client'
import { useState, ReactNode } from 'react'

interface ShinyWrapperProps {
    children: ReactNode
    animationSpeed?: number
    loop?: boolean
    loopDelay?: number
    hoverOnly?: boolean
    shinyStyle?: 'gradient' | 'solid'
    className?: string
    shinyWidth?: string
}

const ShinyWrapper = ({
    children,
    animationSpeed = 1500,
    loop = true,
    loopDelay = 200,
    hoverOnly = false,
    shinyStyle = 'gradient',
    className = '',
    shinyWidth = '30%'
}: ShinyWrapperProps) => {
    const [isHovered, setIsHovered] = useState(false)

    const totalDuration = loop ? animationSpeed + loopDelay : animationSpeed
    const movementPercentage = loop ? (animationSpeed / totalDuration) * 100 : 100

    const shouldAnimate = hoverOnly ? isHovered : true

    const animationStyle = {
        animation: shouldAnimate
            ? `shine ${totalDuration}ms linear ${loop ? 'infinite' : '1'} ${!loop ? 'forwards' : ''
            }`
            : 'none'
    }

    const shinyClass = {
        gradient: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
        solid: 'bg-white/10'
    }

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={hoverOnly ? () => setIsHovered(true) : undefined}
            onMouseLeave={hoverOnly ? () => setIsHovered(false) : undefined}
        >
            <div
                className={`absolute z-1 top-0 -left-1/2 h-full -skew-x-14 ${shinyClass[shinyStyle]}`}
                style={{ ...animationStyle, width: shinyWidth }}
            />
            <div className='relative'>{children}</div>

            <style>
                {`
          @keyframes shine {
            0% {
              left: -50%;
            }
            ${loop ? `${movementPercentage}%` : '100%'} {
              left: 150%;
            }
            ${loop ? '100% { left: 150%; }' : ''}
          }
        `}
            </style>
        </div>
    )
}

export default ShinyWrapper
