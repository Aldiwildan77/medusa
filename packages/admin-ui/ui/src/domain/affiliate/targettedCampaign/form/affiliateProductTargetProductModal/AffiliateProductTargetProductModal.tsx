import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import type { Row } from "react-table"
import Table, {
  TableRowProps as TableRowPropsBase,
} from "../../../../../components/molecules/table"
import TableContainer from "../../../../../components/organisms/table-container"
import BodyCard from "../../../../../components/organisms/body-card"
import { TargettedCampaignFormType } from "../targettedCampaignSchema"
import { useAdminProducts } from "medusa-react"
import { useAffiliateProductTargetProductModalColumn } from "./useAffiliateProductTargetProductModalColumn"
import { PricedProduct } from "@medusajs/client-types"
import { useAffiliateProductTargetProductModalFilters } from "./useAffiliateProductTargetProductModalFilters"
import { Button } from "@medusajs/ui"
import Modal from "../../../../../components/molecules/modal"
import { debounce } from "lodash"

const LIMIT = 10

type Props = {
  selectedProducts: NonNullable<TargettedCampaignFormType["productTargets"]>
  onSubmit: (products: TargettedCampaignFormType["productTargets"]) => void
  onClose: () => void
}

export const AffiliateProductTargetProductModal = (props: Props) => {
  const location = useLocation()
  const [selectedProducts, setSelectedProducts] = useState<
    NonNullable<TargettedCampaignFormType["productTargets"]>
  >(props.selectedProducts)

  const { paginate, filters, setQuery } =
    useAffiliateProductTargetProductModalFilters({
      defaultSearch: location.search,
      limit: LIMIT,
      page: 1,
    })

  const [search, setSearch] = useState("")
  const [numPages, setNumPages] = useState(0)

  const { products, isLoading, count } = useAdminProducts(
    {
      limit: filters.limit,
      offset: filters.page - 1,
      q: filters.query,
    },
    {
      onSuccess: (data) => {
        setNumPages(data.count)
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

  const [columns] = useAffiliateProductTargetProductModalColumn({
    selectedProducts,
    onSelectProduct: (checked, product) => {
      if (checked) {
        setSelectedProducts((prev) => [...prev, product])
      } else {
        setSelectedProducts((prev) =>
          prev.filter((p) => p.productId !== product.productId)
        )
      }
    },
    onSelectAll: (checked, products) => {
      if (checked) {
        // add all current rows to selectedAffiliatorCustomerIds
        // dont just add all rows, because we might have selected some rows from other pages
        setSelectedProducts((prev) => [...prev, ...products])
      } else {
        // remove all current fetched data (from this page) from selectedAffiliatorCustomerIds
        // dont just set it to empty array, because we might have selected some rows from other pages
        setSelectedProducts((prev) =>
          prev.filter(
            (p) =>
              !products.some((product) => product.productId === p.productId)
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
      data: (products as unknown as PricedProduct[]) || [],
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
    <Modal open={true} handleClose={props.onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={props.onClose}>
          <h1 className="inter-xlarge-semibold m-0">Select Products</h1>
        </Modal.Header>
        <BodyCard forceDropdown={false} compact={true} className="h-fit">
          <div className="flex flex-col">
            <p>
              <span className="text-orange-600">
                {selectedProducts.length}/{count}
              </span>{" "}
              products selected
            </p>
            <TableContainer
              numberOfRows={products?.length || 0}
              hasPagination
              pagingState={{
                // TODO: fix paging state for label
                count: count || 0,
                offset: (filters.page - 1) * filters.limit,
                pageSize: (filters.page - 1) * filters.limit + rows.length,
                title: "Products",
                currentPage: pageIndex + 1,
                pageCount: pageCount,
                nextPage: handleNext,
                prevPage: handlePrev,
                hasNext: canNextPage,
                hasPrev: canPreviousPage,
              }}
              isLoading={isLoading}
            >
              <Table
                enableSearch
                searchValue={search}
                handleSearch={setSearch}
                {...getTableProps()}
              >
                <Table.Head>
                  {headerGroups?.map((headerGroup, idx) => (
                    <Table.HeadRow
                      {...headerGroup.getHeaderGroupProps()}
                      key={idx}
                    >
                      {headerGroup.headers.map((col, idx) => {
                        return (
                          <Table.HeadCell
                            className={`min-w-[${col.width}px]`}
                            {...col.getHeaderProps()}
                            key={idx}
                          >
                            {col.render("Header")}
                          </Table.HeadCell>
                        )
                      })}
                    </Table.HeadRow>
                  ))}
                </Table.Head>

                <Table.Body {...getTableBodyProps()}>
                  {rows.map((row, idx) => {
                    prepareRow(row)
                    return (
                      <TableRow row={row} {...row.getRowProps()} key={idx} />
                    )
                  })}
                </Table.Body>
              </Table>
            </TableContainer>
            <Button
              variant="primary"
              className="ml-auto mt-4"
              onClick={() => props.onSubmit(selectedProducts)}
            >
              Confirm
            </Button>
          </div>
        </BodyCard>
      </Modal.Body>
    </Modal>
  )
}

type TableRowProps = TableRowPropsBase & {
  row: Row<PricedProduct>
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
