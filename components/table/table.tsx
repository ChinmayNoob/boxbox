import { type ReactNode, type FC } from 'react'

type Variant = 'default' | 'bordered' | 'light'
type Color =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'xl'

interface TableProps {
  children: ReactNode
  variant?: Variant
  color?: Color
  rounded?: Rounded
}

const Table: FC<TableProps> = ({
  children,
  variant = 'default',
  color = 'default',
  rounded = 'md'
}) => {
  const variants: Record<Variant, string> = {
    default: 'border-0 backdrop-blur-sm shadow-lg',
    bordered: 'border shadow-md',
    light: ''
  }

  const roundeds: Record<Rounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }

  const colors: Record<Color, string> = {
    default: 'bg-zinc-700/30',
    primary: 'bg-blue-500/20',
    secondary: 'bg-indigo-500/20',
    success: 'bg-green-500/30',
    warning: 'bg-yellow-500/40 dark:bg-yellow-500/20',
    danger: 'bg-red-500/20'
  }

  const textColors: Record<Color, string> = {
    default: 'text-gray-300',
    primary: 'text-blue-800 dark:text-blue-600',
    secondary: 'text-indigo-800 dark:text-indigo-600',
    success: 'text-green-800 dark:text-green-600',
    warning: 'text-yellow-800 dark:text-yellow-600',
    danger: 'text-red-800 dark:text-red-500'
  }

  const borderColors: Record<Color, string> = {
    default: 'border-gray-300',
    primary: 'border-blue-800 dark:border-blue-500',
    secondary: 'border-indigo-800 dark:border-indigo-500',
    success: 'border-green-800 dark:border-green-500',
    warning: 'border-yellow-800 dark:border-yellow-500',
    danger: 'border-red-800 dark:border-red-500'
  }

  return (
    <div
      className={`w-full overflow-auto ${variants[variant]} ${
        roundeds[rounded]
      } ${textColors[color]} ${variant === 'bordered' && borderColors[color]}`}
    >
      <table className={`w-full ${variant === 'default' && colors[color]}`}>
        {children}
      </table>
    </div>
  )
}

export default Table
