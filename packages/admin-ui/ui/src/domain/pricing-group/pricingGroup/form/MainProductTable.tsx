import { useTable } from "react-table"
import type { Row } from "react-table"
import Table, {
  TableRowProps as TableRowPropsBase,
} from "../../../../components/molecules/table"
import TableContainer from "../../../../components/organisms/table-container"
import BodyCard from "../../../../components/organisms/body-card"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { PricingGroupFormType } from "./pricingGroupSchema"
import { useMainProductTableColumn } from "./mainProductHooks"
import { Button, useToggleState } from "@medusajs/ui"
import { ListProductTable } from "./listProductTable/ListProductTable"
import { useMemo } from "react"

type Props = {
  errors: Partial<FieldErrors<PricingGroupFormType>>
  setValue: UseFormSetValue<PricingGroupFormType>
  values: PricingGroupFormType
}

export const MainProductTable = (props: Props) => {
  const [isProductModalShown, openProductModal, closeProductModal] =
    useToggleState()

  const groupedProducts = useMemo(() => {
    const products = props.values?.mainProducts
    // filter out product that has same productId
    const groupedProducts = products?.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.productId === product.productId)
    )

    // get lowest price product for each productId
    const lowestPriceProductsObj = products?.reduce((acc, product) => {
      if (!acc[product.productId]) {
        acc[product.productId] = product
      } else if (acc[product.productId].originalPrice > product.originalPrice) {
        acc[product.productId] = product
      }
      return acc
    }, {} as Record<string, PricingGroupFormType["mainProducts"][0]>)

    // return grouped products with lowest price
    return groupedProducts?.map(
      (product) => lowestPriceProductsObj[product.productId]
    )
  }, [props.values?.mainProducts])

  const [columns] = useMainProductTableColumn({
    data: groupedProducts,
    onDelete: (productId) => {
      console.log("productId", productId)
      console.log("mainProducts", props.values?.mainProducts)
      const newData =
        props.values?.mainProducts?.filter(
          (product) => product.productId !== productId
        ) || []

      props.setValue("mainProducts", newData)
    },
  })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: groupedProducts || [],
    })

  return (
    <>
      <BodyCard
        forceDropdown={false}
        compact={true}
        title="Select Main Products"
        className="h-fit"
      >
        <div className="flex flex-col">
          {props.errors.mainProducts && (
            <span className="col-span-2 text-sm  text-red-700">
              {props.errors.mainProducts.message}
            </span>
          )}
          <div className="flex flex-row items-center justify-between">
            <p>{props.values.mainProducts?.length || "0"} product(s)</p>
            <Button
              type="button"
              variant="secondary"
              onClick={openProductModal}
            >
              Add product
            </Button>
          </div>
          <TableContainer
            numberOfRows={props.values?.mainProducts?.length || 0}
            hasPagination={false}
          >
            <Table {...getTableProps()}>
              <Table.Head>
                {headerGroups?.map((headerGroup, idx) => (
                  <Table.HeadRow
                    {...headerGroup.getHeaderGroupProps()}
                    key={idx}
                  >
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
        </div>
      </BodyCard>
      {isProductModalShown && (
        <ListProductTable
          enableMainProductCheck={true}
          onClose={closeProductModal}
          onSubmit={(products) => {
            props.setValue(
              "mainProducts",
              products.map((p) => ({
                originalPrice: p.originalPrice,
                productId: p.productId,
                productName: p.productName,
                productImage: p.productImage,
                productVariantId: p.productVariantId,
                productVariantName: p.productVariantName,
                stock: p.stock,
              }))
            )
            closeProductModal()
          }}
          selectedProducts={
            props?.values?.mainProducts?.map((p) => ({
              discountedPrice: 0,
              maxQuantity: 0,
              originalPrice: p.originalPrice,
              productId: p.productId,
              productName: p.productName,
              productImage: p.productImage,
              productVariantId: p.productVariantId,
              productVariantName: p.productVariantName,
              stock: p.stock,
            })) || []
          }
        />
      )}
    </>
  )
}

type TableRowProps = TableRowPropsBase & {
  row: Row<PricingGroupFormType["mainProducts"][0]>
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
