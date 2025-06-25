import { type ReactNode, type FC } from 'react'

type Color =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'

interface TableBodyProps {
  isLoading?: boolean
  loadingContent?: ReactNode
  isEmpty?: boolean
  emptyMessage?: string
  divide?: boolean
  color?: Color
  children: ReactNode
}

const TableBody: FC<TableBodyProps> = ({
  isLoading = false,
  loadingContent,
  isEmpty = false,
  emptyMessage = 'No data available.',
  divide = false,
  color = 'default',
  children
}) => {
  const divideColors: Record<Color, string> = {
    default: 'divide-gray-300',
    primary: 'divide-blue-800 dark:divide-blue-500',
    secondary: 'divide-indigo-800 dark:divide-indigo-500',
    success: 'divide-green-800 dark:divide-green-500',
    warning: 'divide-yellow-800 dark:divide-yellow-500',
    danger: 'divide-red-800 dark:divide-red-500'
  }

  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={100} className='py-6 text-center'>
            {loadingContent}
          </td>
        </tr>
      </tbody>
    )
  }

  if (isEmpty) {
    return (
      <tbody>
        <tr>
          <td colSpan={100} className='py-6 text-center'>
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody className={`${divide && `divide-y ${divideColors[color]}`}`}>
      {children}
    </tbody>
  )
}

export default TableBody
