import { useMemo } from "react"
import { Column } from "react-table"
import { PricingGroupFormType } from "./pricingGroupSchema"
import { Button } from "@medusajs/ui"
import { formatAmountWithSymbol } from "../../../../utils/prices"

type Params = {
  data: PricingGroupFormType["mainProducts"]
  onDelete: (productId: string) => void
}

export const useMainProductTableColumn = (params: Params) => {
  const columns: Column<
    NonNullable<PricingGroupFormType["mainProducts"]>[0]
  >[] = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "productName",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row gap-2 p-2">
              <img src={original.productImage} className="h-10 w-10" />
              <div className="flex flex-col gap-0">
                <p className="text-[14px]">{original.productName}</p>
                <p className="text-[12px] text-gray-500">
                  {original.productId}
                </p>
              </div>
            </div>
          )
        },
      },
      {
        Header: "Current Price",
        accessor: "originalPrice",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row gap-2 p-2">
              <p className="text-[14px]">
                {formatAmountWithSymbol({
                  amount: original.originalPrice || 0,
                  currency: "IDR",
                })}
              </p>
            </div>
          )
        },
      },
      {
        Header: "Stock",
        accessor: "stock",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row gap-2 p-2">
              <p className="text-[14px]">{original.stock || 0}</p>
            </div>
          )
        },
      },
      {
        Header: "Action",
        accessor: "productId",
        Cell: ({ cell: { value } }) => {
          return (
            <Button
              variant="danger"
              size="base"
              onClick={() => params.onDelete(value)}
            >
              Delete
            </Button>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.data]
  )

  return [columns] as const
}
