import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import type { Row } from "react-table"
import Table, {
  TableRowProps as TableRowPropsBase,
} from "../../../../components/molecules/table"
import TableContainer from "../../../../components/organisms/table-container"
import { useTargettedCampaignFilters } from "./useAffiliateUserTargetFilters"
import { useTargettedCampaignColumn } from "./useAffiliateUserTargetColumn"
import { useGetAffiliatorList } from "../../affiliateHooks"
import { Affiliator } from "../../../../types/affiliate"
import BodyCard from "../../../../components/organisms/body-card"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { debounce } from "lodash"
import { TargettedCampaignFormType } from "./targettedCampaignSchema"

const LIMIT = 10

type Props = {
  errors: Partial<FieldErrors<TargettedCampaignFormType>>
  setValue: UseFormSetValue<TargettedCampaignFormType>
  values: TargettedCampaignFormType
}

export const AffiliateUserTargetTable = (props: Props) => {
  const location = useLocation()
  const [selectedAffiliatorCustomerIds, setSelectedAffiliatorCustomerIds] =
    useState<string[]>(props.values.customerIds || [])

  const { paginate, filters, setQuery } = useTargettedCampaignFilters({
    defaultSearch: location.search,
    limit: LIMIT,
    page: 1,
  })

  // TODO: add filter
  const [search, setSearch] = useState("")
  const [numPages, setNumPages] = useState(0)

  const getAffiliator = useGetAffiliatorList(
    {
      limit: filters.limit,
      page: filters.page,
      search: filters.query,
    },
    {
      onSuccess: (data) => {
        setNumPages(data.pagination.total_pages)
      },
    }
  )

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setQuery(search)
      console.log("search", search)
    }, 500),
    []
  )

  useEffect(() => {
    debouncedSearch(search)
  }, [debouncedSearch, search])

  useEffect(() => {
    props.setValue("customerIds", selectedAffiliatorCustomerIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAffiliatorCustomerIds])

  const [columns] = useTargettedCampaignColumn({
    selectedAffiliatorCustomerIds,
    onSelectAffiliator: (checked, customer_id) => {
      if (checked) {
        setSelectedAffiliatorCustomerIds((prev) => [...prev, customer_id])
      } else {
        setSelectedAffiliatorCustomerIds((prev) =>
          prev.filter((id) => id !== customer_id)
        )
      }
    },
    onSelectedAll: (checked, customerIds) => {
      if (checked) {
        // add all current rows to selectedAffiliatorCustomerIds
        // dont just add all rows, because we might have selected some rows from other pages
        setSelectedAffiliatorCustomerIds((prev) => [...prev, ...customerIds])
      } else {
        // remove all current fetched data (from this page) from selectedAffiliatorCustomerIds
        // dont just set it to empty array, because we might have selected some rows from other pages
        setSelectedAffiliatorCustomerIds((prev) =>
          prev.filter(
            (id) =>
              !getAffiliator.data?.data.map((d) => d.customer_id).includes(id)
          )
        )
      }
    },
  })

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
      <div className="flex flex-col">
        <p>
          <span className="text-orange-600">
            {selectedAffiliatorCustomerIds.length}/
            {getAffiliator.data?.pagination.total}
          </span>{" "}
          affiliates selected
        </p>
        <TableContainer
          numberOfRows={getAffiliator.data?.data?.length || 0}
          hasPagination
          pagingState={{
            // TODO: fix paging state for label
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
        {props.errors.customerIds && (
          <p className="text-sm text-red-700">
            {props.errors.customerIds.message}
          </p>
        )}
      </div>
    </BodyCard>
  )
}

type TableRowProps = TableRowPropsBase & {
  row: Row<Affiliator>
}

const TableRow = ({ row, ...rest }: TableRowProps) => {
  return (
    <Table.Row color="inherit" {...rest}>
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
