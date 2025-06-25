import { type ReactNode, type FC } from 'react'

type Color =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'

interface TableHeaderProps {
  children: ReactNode
  color?: Color
}

const TableHeader: FC<TableHeaderProps> = ({ children, color = 'default' }) => {
  const colors: Record<Color, string> = {
    default: 'bg-zinc-700/30',
    primary: 'bg-blue-500/20',
    secondary: 'bg-indigo-500/20',
    success: 'bg-green-500/30',
    warning: 'bg-yellow-500/40 dark:bg-yellow-500/20',
    danger: 'bg-red-500/20'
  }

  return (
    <thead className={`border-0 backdrop-blur-md shadow-md ${colors[color]}`}>
      <tr>{children}</tr>
    </thead>
  )
}

export default TableHeader
