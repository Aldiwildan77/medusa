import React, { useMemo } from "react"
import Table, {
  TableRowProps as TableRowPropsBase,
} from "../../../../components/molecules/table"
import TableContainer from "../../../../components/organisms/table-container"
import BodyCard from "../../../../components/organisms/body-card"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { PricingGroupFormType } from "./pricingGroupSchema"
import { Button, useToggleState } from "@medusajs/ui"
import { ListProductTable } from "./listProductTable/ListProductTable"
import { useAddOnProductTableColumn } from "./addOnProductHooks"
import { Column, ColumnWithStrictAccessor } from "react-table"

type Props = {
  errors: Partial<FieldErrors<PricingGroupFormType>>
  setValue: UseFormSetValue<PricingGroupFormType>
  values: PricingGroupFormType
}

export const AddOnProductTable = (props: Props) => {
  const [isProductModalShown, openProductModal, closeProductModal] =
    useToggleState()

  const products = useMemo(
    () => props.values?.addOnProducts,
    [props.values?.addOnProducts]
  )

  const [columns] = useAddOnProductTableColumn({
    data: products,
    errors: props.errors,
    onChangePrice: ({ variantId, price }) => {
      console.log("variantId", variantId)
      console.log("price", price)
      console.log("products", props.values?.addOnProducts)
      const newData =
        props.values?.addOnProducts?.map((product) => {
          if (product.productVariantId === variantId) {
            return { ...product, discountedPrice: price }
          }
          return product
        }) || []

      props.setValue("addOnProducts", newData)
    },
    onDelete: (productId) => {
      const newData =
        props.values?.addOnProducts?.filter(
          (product) => product.productId !== productId
        ) || []

      props.setValue("addOnProducts", newData)
    },
  })

  return (
    <>
      <BodyCard
        forceDropdown={false}
        compact={true}
        title="Select Add On Products"
        className="h-fit"
      >
        <div className="flex flex-col">
          {props.errors.addOnProducts && (
            <span className="col-span-2 text-sm text-red-700">
              {props.errors.addOnProducts.message}
            </span>
          )}
          <div className="flex flex-row items-center justify-between">
            <p>{props.values.addOnProducts?.length || "0"} product(s)</p>
            <Button
              type="button"
              variant="secondary"
              onClick={openProductModal}
            >
              Add product
            </Button>
          </div>
          <TableContainer
            numberOfRows={props.values?.addOnProducts?.length || 0}
            hasPagination={false}
          >
            <Table>
              <Table.Head>
                <Table.HeadRow>
                  {columns.map((col, idx) => (
                    <Table.HeadCell className="min-w-[100px]" key={idx}>
                      {col.Header}
                    </Table.HeadCell>
                  ))}
                </Table.HeadRow>
              </Table.Head>

              <Table.Body>
                {products?.map((product, idx) => (
                  <TableRow
                    key={idx}
                    row={product}
                    columns={columns}
                    rowIndex={idx}
                  />
                ))}
              </Table.Body>
            </Table>
          </TableContainer>
        </div>
      </BodyCard>
      {isProductModalShown && (
        <ListProductTable
          onClose={closeProductModal}
          onSubmit={(products) => {
            props.setValue("addOnProducts", products)
            closeProductModal()
          }}
          selectedProducts={props?.values?.addOnProducts || []}
          disabledProductIds={
            props?.values?.mainProducts?.map((product) => product.productId) ||
            []
          }
        />
      )}
    </>
  )
}

type TableRowProps = TableRowPropsBase & {
  row: PricingGroupFormType["addOnProducts"][0]
  columns: ColumnWithStrictAccessor<
    NonNullable<PricingGroupFormType["addOnProducts"]>[0]
  >[]
  rowIndex: number
}

const TableRow = ({ row, columns, rowIndex, ...rest }: TableRowProps) => {
  return (
    <Table.Row color="inherit" {...rest}>
      {columns.map((col, index) => (
        <Table.Cell
          key={index}
          className={typeof col.Header !== "string" ? `w-[${col.width}px]` : ""}
        >
          {col.Cell
            ? col.Cell({
                row: { original: row, index: rowIndex },
                cell: {
                  value: row[col.accessor as keyof typeof row],
                },
              })
            : row[col.accessor as keyof typeof row]}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}
