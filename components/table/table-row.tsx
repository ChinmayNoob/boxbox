import { type FC, type ReactNode } from 'react'

type Color =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'

interface TableRowProps {
  isSelected?: boolean
  isDisabled?: boolean
  isHovered?: boolean
  isFocusVisible?: boolean
  isFirst?: boolean
  isLast?: boolean
  isOdd?: boolean
  id?: string
  selectedColor?: Color
  hoverColor?: Color
  oddColor?: Color
  children: ReactNode
}

const TableRow: FC<TableRowProps> = ({
  isSelected = false,
  isDisabled = false,
  isHovered = false,
  isFocusVisible = false,
  isFirst = false,
  isLast = false,
  isOdd = false,
  id,
  selectedColor = 'default',
  hoverColor = 'default',
  oddColor = 'default',
  children
}) => {
  const selectedColors: Record<Color, string> = {
    default: 'bg-zinc-700/70',
    primary: 'bg-blue-500/60',
    secondary: 'bg-indigo-500/60',
    success: 'bg-green-500/70',
    warning: 'bg-yellow-500/80 dark:bg-yellow-500/60',
    danger: 'bg-red-500/60'
  }

  const hoverColors: Record<Color, string> = {
    default: 'hover:bg-zinc-700/50',
    primary: 'hover:bg-blue-500/40',
    secondary: 'hover:bg-indigo-500/40',
    success: 'hover:bg-green-500/50',
    warning: 'hover:bg-yellow-500/60 dark:hover:bg-yellow-500/40',
    danger: 'hover:bg-red-500/40'
  }

  const oddColors: Record<Color, string> = {
    default: 'bg-zinc-800/30',
    primary: 'bg-blue-600/20',
    secondary: 'bg-indigo-600/20',
    success: 'bg-green-600/30',
    warning: 'bg-yellow-600/40 dark:bg-yellow-600/20',
    danger: 'bg-red-600/20'
  }

  return (
    <tr
      key={id}
      className={`
        ${isSelected ? selectedColors[selectedColor] : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isHovered ? hoverColors[hoverColor] : ''}
        ${isFocusVisible ? 'ring-2 ring-blue-500' : ''}
        ${isFirst ? 'rounded-t-lg' : ''}
        ${isLast ? 'rounded-b-lg' : ''}
        ${isOdd ? oddColors[oddColor] : ''}
        transition-colors duration-200
      `}
    >
      {children}
    </tr>
  )
}

export default TableRow
