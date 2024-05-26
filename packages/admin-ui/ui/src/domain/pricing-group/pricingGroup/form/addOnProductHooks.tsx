import { ChangeEvent, useMemo } from "react"
import { Column } from "react-table"
import { PricingGroupFormType } from "./pricingGroupSchema"
import { Button } from "@medusajs/ui"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { FieldErrors } from "react-hook-form"

type Params = {
  data: PricingGroupFormType["addOnProducts"]
  errors: Partial<FieldErrors<PricingGroupFormType>>
  onChangePrice: (data: { variantId: string; price: number }) => void
  onChangeMaxQty: (data: { variantId: string; qty: number }) => void
  onDelete: (variantId: string) => void
}

export const useAddOnProductTableColumn = (params: Params) => {
  const columns: Column<
    NonNullable<PricingGroupFormType["addOnProducts"]>[0]
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
                  {original.productVariantName}
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
        Header: "Add-on Price",
        accessor: "discountedPrice",
        Cell: ({ row: { original, index } }) => {
          return (
            <PriceInput
              error={
                params.errors.addOnProducts?.[index]?.discountedPrice?.message
              }
              value={original.discountedPrice}
              onChange={(price) =>
                params.onChangePrice({
                  variantId: original.productVariantId,
                  price,
                })
              }
            />
          )
        },
      },
      {
        Header: "Add-on Price",
        accessor: "maxQuantity",
        Cell: ({ row: { original, index } }) => {
          return (
            <PurchaseLimitInput
              error={params.errors.addOnProducts?.[index]?.maxQuantity?.message}
              value={original.maxQuantity}
              onChange={(qty) =>
                params.onChangeMaxQty({
                  variantId: original.productVariantId,
                  qty,
                })
              }
            />
          )
        },
      },
      {
        Header: "Action",
        accessor: "productVariantId",
        Cell: ({ cell: { value }, row: { index } }) => {
          // only show delete button for first variant from the same productId
          const firstVariantIndex = params.data.findIndex(
            (product) => product.productId === value
          )

          // if the first variant is not the current variant, return null
          if (firstVariantIndex !== index) {
            return null
          }

          return (
            <Button
              type="button"
              variant="danger"
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

type PriceInputProps = {
  value: number
  onChange: (price: number) => void
  error?: string
}

function PriceInput(props: PriceInputProps) {
  return (
    <div className="flex flex-col">
      <div
        className="relative flex flex-row"
        style={{
          paddingRight: "40px",
        }}
      >
        <div
          className="inline-flex items-center rounded-l-lg bg-gray-200 px-2 text-sm text-gray-900"
          style={{
            insetInlineEnd: 0,
          }}
        >
          Rp
        </div>
        <input
          name="discountedPrice"
          type="number"
          className="block w-full rounded-r-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="0.5 - 80"
          required
          value={props.value}
          onChange={(e) => props.onChange(Number(e.target.value))}
        />
      </div>
      {props?.error && (
        <span className="col-span-2 text-sm  text-red-700">{props?.error}</span>
      )}
    </div>
  )
}

type PurchaseLimitInputProps = {
  value: number
  onChange: (price: number) => void
  error?: string
}

function PurchaseLimitInput(props: PurchaseLimitInputProps) {
  return (
    <div className="flex flex-col">
      <input
        name="maxQuantity"
        type="number"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder="0.5 - 80"
        required
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
      {props?.error && (
        <span className="col-span-2 text-sm  text-red-700">{props?.error}</span>
      )}
    </div>
  )
}
