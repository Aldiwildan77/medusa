import { PropsWithChildren } from "react"
import Spinner from "../../atoms/spinner"
import { TablePagination } from "./pagination"
import { PagingProps } from "./types"

const ROW_HEIGHT = 40

type Props = PropsWithChildren<
  | {
      isLoading?: boolean
      hasPagination: false
      numberOfRows?: number
      pagingState?: undefined
    }
  | {
      isLoading?: boolean
      hasPagination?: true
      pagingState: PagingProps
      numberOfRows?: number
    }
>

const TableContainer = ({
  children,
  // TODO: remove (redundant)
  hasPagination,
  pagingState,
  isLoading,
  numberOfRows = 12,
}: Props) => {
  // We use the number of rows (query limit) plus the header row to calculate the minimum height of the table, to avoid the table jumping around while loading.
  const minHeight = (numberOfRows + 1) * ROW_HEIGHT

  return (
    <div>
      <div
        className="relative"
        style={{
          minHeight,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
            <Spinner variant="secondary" />
          </div>
        )}
        {children}
      </div>
      {hasPagination && pagingState && (
        <div className="mt-14">
          <TablePagination pagingState={pagingState} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}

export default TableContainer
