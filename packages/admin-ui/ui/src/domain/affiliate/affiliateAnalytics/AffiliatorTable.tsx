import { useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import type { Row } from "react-table"
import Table, {
  TableRowProps as TableRowPropsBase,
} from "../../../components/molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import { useTargettedCampaignFilters } from "./useAffiliateUserTargetFilters"
import { useAffiliatorTableColumn } from "./affiliatorHooks"
import { Affiliator } from "../../../types/affiliate"
import BodyCard from "../../../components/organisms/body-card"
import { useGetAffiliatorList } from "../affiliateHooks"
import clsx from "clsx"

const LIMIT = 10

type Props = {
  selectedAffiliatorCustomerId: string
  setSelectedAffiliatorCustomerId: (id: string) => void
}

export const AffiliatorTable = (props: Props) => {
  const location = useLocation()

  const { paginate, filters } = useTargettedCampaignFilters({
    defaultSearch: location.search,
    limit: LIMIT,
    page: 1,
  })

  const [numPages, setNumPages] = useState(0)

  const getAffiliator = useGetAffiliatorList(
    {
      limit: filters.limit,
      page: filters.page,
    },
    {
      onSuccess: (data) => {
        setNumPages(data.pagination.total_pages)
      },
    }
  )

  const columns = useAffiliatorTableColumn(props)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: getAffiliator.data?.data || [],
      manualPagination: true,
      initialState: {
        pageIndex: 0,
        pageSize: filters.limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  return (
    <BodyCard
      forceDropdown={false}
      compact={true}
      title="Select Affiliates"
      className="h-fit"
    >
      <TableContainer
        numberOfRows={getAffiliator.data?.data?.length || 0}
        hasPagination
        pagingState={{
          count: getAffiliator.data?.pagination.total || 0,
          offset: (filters.page - 1) * filters.limit,
          pageSize: (filters.page - 1) * filters.limit + rows.length,
          title: "Affiliates",
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
        isLoading={getAffiliator.isFetching}
      >
        <Table {...getTableProps()}>
          <Table.Head>
            {headerGroups?.map((headerGroup, idx) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((col, idx) => (
                  <Table.HeadCell
                    className="min-w-[100px]"
                    {...col.getHeaderProps()}
                    key={idx}
                  >
                    {col.render("Header")}
                    {/* {col.render("Header", { index: idx })} */}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>

          <Table.Body {...getTableBodyProps()}>
            {rows.map((row, idx) => {
              prepareRow(row)
              return (
                <TableRow
                  row={row}
                  setSelectedAffiliatorCustomerId={
                    props.setSelectedAffiliatorCustomerId
                  }
                  {...row.getRowProps()}
                  key={idx}
                />
              )
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </BodyCard>
  )
}

type TableRowProps = TableRowPropsBase & {
  row: Row<Affiliator>
  setSelectedAffiliatorCustomerId: (id: string) => void
}

const TableRow = ({
  row,
  setSelectedAffiliatorCustomerId,
  ...rest
}: TableRowProps) => {
  return (
    <Table.Row
      color="inherit"
      className={clsx(rest.className, "cursor-pointer hover:bg-gray-100")}
      onClick={() => setSelectedAffiliatorCustomerId(row.original.customer_id)}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell
            {...cell.getCellProps()}
            key={index}
            className={
              typeof cell.column.Header !== "string"
                ? `w-[${cell.column.width}px]`
                : ""
            }
          >
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
