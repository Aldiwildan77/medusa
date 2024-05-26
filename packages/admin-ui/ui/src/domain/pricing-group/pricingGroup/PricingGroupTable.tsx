import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import type { Row } from "react-table"
import Table, {
  TableRowProps as TableRowPropsBase,
} from "../../../components/molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import { usePricingGroupFilters } from "./usePricingGroupFilters"
import { usePricingGroupColumn } from "./usePricingGroupColumn"
import {
  useDeletePricingGroup,
  useGetPricingGroups,
} from "../pricingGroupHooks"
import BodyCard from "../../../components/organisms/body-card"
import { debounce } from "lodash"
import { PricingGroupListData } from "../../../types/pricingGroup"

const LIMIT = 10

export const PricingGroupTable = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { paginate, filters, setQuery } = usePricingGroupFilters({
    defaultSearch: location.search,
    limit: LIMIT,
    page: 1,
  })

  const [search, setSearch] = useState("")
  const [numPages, setNumPages] = useState(0)
  const [deleteIndex, setDeleteIndex] = useState(-1)

  const getPricingGroup = useGetPricingGroups(
    {
      limit: filters.limit,
      page: filters.page,
      keyword: filters.query,
    },
    {
      onSuccess: (data) => {
        setNumPages(data.pagination.total_pages)
      },
    }
  )
  const deleteMutation = useDeletePricingGroup()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setQuery(search)
    }, 500),
    []
  )

  useEffect(() => {
    debouncedSearch(search)
  }, [debouncedSearch, search])

  const [columns] = usePricingGroupColumn({
    indexDeleting: deleteIndex,
    onDelete: async ({ id, index }) => {
      setDeleteIndex(index)
      try {
        await deleteMutation.mutateAsync({
          id,
        })
        getPricingGroup.refetch()
      } catch (error) {
        console.error(error)
      }
      setDeleteIndex(-1)
    },
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: getPricingGroup.data?.data || [],
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
      title="Add-on Deals"
      className="h-fit"
      actionables={[
        {
          label: "Add Add-on Deal",
          onClick: () => navigate("/a/pricing-group/create"),
        },
      ]}
    >
      <TableContainer
        numberOfRows={getPricingGroup.data?.data.length}
        hasPagination
        pagingState={{
          count: getPricingGroup.data?.pagination.total || 0,
          offset: (filters.page - 1) * filters.limit,
          pageSize: (filters.page - 1) * filters.limit + rows.length,
          title: "Add-on Deals",
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
        isLoading={getPricingGroup.isFetching}
      >
        <Table
          enableSearch
          searchValue={search}
          handleSearch={setSearch}
          {...getTableProps()}
        >
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
              return <TableRow row={row} {...row.getRowProps()} key={idx} />
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </BodyCard>
  )
}

type TableRowProps = TableRowPropsBase & {
  row: Row<PricingGroupListData>
}

const TableRow = ({ row, ...rest }: TableRowProps) => {
  const data = row.original
  // const { getActions } = useProductActions(product)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/pricing-group/${data.id}`}
      {...rest}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()} key={index}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
