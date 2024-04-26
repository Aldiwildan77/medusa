import { isEmpty } from "lodash"
import qs from "qs"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import type { Row } from "react-table"
import { useTranslation } from "react-i18next"
import Table, { TableType } from "../../../components/molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import { useTargettedCampaignFilters } from "./useTargettedCampaignFilters"
import { useTargettedCampaignColumn } from "./useTargettedCampaignColumn"
import { useGetTargettedCampaign } from "../affiliateHooks"
import { AffiliateGroups } from "../../../types/affiliate"
import BodyCard from "../../../components/organisms/body-card"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  fields: "id,title,thumbnail,status,handle,collection_id",
  expand:
    "variants,options,variants.prices,variants.options,collection,tags,type,images",
  is_giftcard: false,
}

const LIMIT = 10

export const TargettedCampaignTable = () => {
  const location = useLocation()
  const { t } = useTranslation()

  const { paginate, filters } = useTargettedCampaignFilters(
    location.search,
    defaultQueryProps
  )

  const offs = filters.offset

  // const [search, setSearch] = useState()
  // TODO: add filter
  const [numPages, setNumPages] = useState(0)

  const getTargettedCampaign = useGetTargettedCampaign({
    limit: 10,
    page: 1,
  })

  useEffect(() => {
    const controlledPageCount = Number(
      getTargettedCampaign.data?.pagination.total_pages
    )
    setNumPages(controlledPageCount)
  }, [getTargettedCampaign.data])

  const [columns] = useTargettedCampaignColumn()

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
      data: getTargettedCampaign.data?.data || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offs / LIMIT),
        pageSize: LIMIT,
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
      title="Targetted Campaign"
      subtitle="Setup competitive commission rate for specific Affiliates & products. Increase your chances to be promoted by top Shopee Affiliates."
      className="h-fit"
    >
      <TableContainer
        numberOfRows={DEFAULT_PAGE_SIZE}
        hasPagination
        pagingState={{
          count: getTargettedCampaign.data?.pagination.total || 0,
          offset: offs,
          pageSize: offs + rows.length,
          title: t("product-table-products", "Products"),
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
        isLoading={getTargettedCampaign.isFetching}
      >
        <Table
          // enableSearch
          // searchValue={search}
          // handleSearch={setSearch}
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

type TableRowProps = TableType["Row"] & {
  row: Row<AffiliateGroups>
}

const TableRow = ({ row, ...rest }: TableRowProps) => {
  const data = row.original
  // const { getActions } = useProductActions(product)

  return (
    <Table.Row
      color={"inherit"}
      // TODO: update linkTo
      linkTo={`/a/products/${data.serial}`}
      actions={[]}
      // actions={getActions()}
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
