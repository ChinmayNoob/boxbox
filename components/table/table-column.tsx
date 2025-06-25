import { type ReactNode, type FC } from 'react'

interface TableColumnProps {
  children: ReactNode
}

const TableColumn: FC<TableColumnProps> = ({ children }) => {
  return (
    <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>
      {children}
    </th>
  )
}

export default TableColumn
