import { useMemo } from "react"
import { Column } from "react-table"
import { TargettedCampaignForm } from "./targettedCampaignSchema"
import { Button } from "@medusajs/ui"
import { FieldErrors } from "react-hook-form"

type Params = {
  data: TargettedCampaignForm["productTargets"]
  errors: Partial<FieldErrors<TargettedCampaignForm>>
  onChangeRate: (data: { productId: string; rate: number }) => void
  onDelete: (productId: string) => void
}

export const useAffiliateProductTargetProductColumn = (params: Params) => {
  const columns: Column<
    NonNullable<TargettedCampaignForm["productTargets"]>[0]
  >[] = useMemo(
    // () => [],
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
        Header: "Commision Rate",
        accessor: "commisionRate",
        Cell: ({ row: { original, index } }) => {
          return (
            <div className="flex flex-col">
              <div
                className="relative flex flex-row"
                style={{
                  paddingRight: "40px",
                }}
              >
                <input
                  name="name"
                  type="number"
                  className="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.5 - 80"
                  style={{
                    borderStartStartRadius: "0.5rem",
                    borderEndStartRadius: "0.5rem",
                  }}
                  required
                  value={original.commisionRate}
                  onChange={(e) =>
                    params.onChangeRate({
                      productId: original.productId,
                      rate: Number(e.target.value),
                    })
                  }
                />
                <div
                  className="inline-flex items-center rounded-r-lg bg-gray-200 px-2 text-sm text-gray-900"
                  style={{
                    insetInlineEnd: 0,
                    borderEndEndRadius: "0.5rem",
                    borderStartEndRadius: "0.5rem",
                  }}
                >
                  %
                </div>
              </div>
              {params.errors.productTargets?.[index]?.commisionRate && (
                <span className="col-span-2 text-sm  text-red-700">
                  {
                    params.errors.productTargets?.[index]?.commisionRate
                      ?.message
                  }
                </span>
              )}
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
    [params.data, params.errors]
  )

  return [columns] as const
}
