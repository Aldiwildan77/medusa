import { useTable } from "react-table"
import type { Row } from "react-table"
import Table, {
  TableRowProps as TableRowPropsBase,
} from "../../../../components/molecules/table"
import TableContainer from "../../../../components/organisms/table-container"
import BodyCard from "../../../../components/organisms/body-card"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { TargettedCampaignForm } from "./targettedCampaignSchema"
import { useAffiliateProductTargetProductColumn } from "./useAffiliateProductTargetProductColumn"
import { Button, useToggleState } from "@medusajs/ui"
import { AffiliateProductTargetProductModal } from "./affiliateProductTargetProductModal/AffiliateProductTargetProductModal"

type Props = {
  errors: Partial<FieldErrors<TargettedCampaignForm>>
  setValue: UseFormSetValue<TargettedCampaignForm>
  values: TargettedCampaignForm
}

export const AffiliateProductTargetProduct = (props: Props) => {
  const [isProductModalShown, openProductModal, closeProductModal] =
    useToggleState()

  const [columns] = useAffiliateProductTargetProductColumn({
    data: props.values?.productTargets,
    onChangeRate: (data) => {
      const newData =
        props.values?.productTargets?.map((product) => {
          if (product.productId === data.productId) {
            return { ...product, commisionRate: data.rate }
          }
          return product
        }) || []

      props.setValue("productTargets", newData)
    },
    onDelete: (productId) => {
      const newData =
        props.values?.productTargets?.filter(
          (product) => product.productId !== productId
        ) || []

      props.setValue("productTargets", newData)
    },
  })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: props.values?.productTargets || [],
    })

  return (
    <>
      <BodyCard forceDropdown={false} compact={true} className="h-fit">
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <p>{props.values.productTargets?.length || "0"} product(s)</p>
            <Button
              type="button"
              variant="secondary"
              onClick={openProductModal}
            >
              Add product
            </Button>
          </div>
          <TableContainer hasPagination={false}>
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
        <AffiliateProductTargetProductModal
          onClose={closeProductModal}
          onSubmit={(products) => {
            props.setValue("productTargets", products)
            closeProductModal()
          }}
          selectedProducts={props.values.productTargets || []}
        />
      )}
    </>
  )
}

type TableRowProps = TableRowPropsBase & {
  row: Row<TargettedCampaignForm["productTargets"][0]>
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
